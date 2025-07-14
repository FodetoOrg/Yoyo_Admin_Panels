import { UploadIcon, X } from "lucide-react";

import { formatBytes } from "./utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

interface FileState {
  file: File | null;
  preview: string;
  name?: string;
  size?: number;
  isExisting?: boolean;
  base64?: string;
}

interface FileUploaderProps {
  field: {
    name: string;
    maxFileSize?: number;
    maxFiles?: number;
  };
  onFileChange: (fieldName: string, files: FileState[]) => void;
  onFileRemove: (fieldName: string, index: number) => void;
  files: FileState[];
}

const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB total limit
const COMPRESSION_QUALITY = 0.7; // 70% quality for compression

export const FileUploader = ({
  field,
  onFileChange,
  onFileRemove,
  files = [],
}: FileUploaderProps) => {
  const maxSize = field.maxFileSize || 1024 * 1024 * 2; // 2MB default per file
  const maxFiles = field.maxFiles || 1;

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            COMPRESSION_QUALITY
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const calculateTotalSize = (currentFiles: FileState[], newFiles: File[]): number => {
    const existingSize = currentFiles.reduce((sum, file) => sum + (file.size || 0), 0);
    const newSize = newFiles.reduce((sum, file) => sum + file.size, 0);
    return existingSize + newSize;
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    // Check total number of files
    if (acceptedFiles.length + files.length > maxFiles) {
      alert(`Cannot upload more than ${maxFiles} files`);
      return;
    }

    // Check total size
    if (calculateTotalSize(files, acceptedFiles) > MAX_TOTAL_SIZE) {
      alert(`Total size of all files cannot exceed ${formatBytes(MAX_TOTAL_SIZE)}`);
      return;
    }

    // Validate and compress files
    const validFiles = await Promise.all(
      acceptedFiles
        .filter((file) => {
          if (file.size > maxSize) {
            alert(`File ${file.name} is larger than ${formatBytes(maxSize)}`);
            return false;
          }
          return true;
        })
        .map(async (file) => {
          try {
            // Compress image if it's an image file
            if (file.type.startsWith('image/')) {
              return await compressImage(file);
            }
            return file;
          } catch (error) {
            console.error('Error compressing file:', error);
            return file;
          }
        })
    );

    try {
      if (validFiles.length > 0) {
        // Convert files to base64
        const base64Files = await Promise.all(
          validFiles.map(async (file) => {
            const base64 = await convertToBase64(file);
            return {
              data: base64,
              filename: file.name
            };
          })
        );
        
        // Upload to server
        const response = await apiService.post(ROUTES.UPLOAD_IMAGES_BASE64_ROUTE, {
          images: base64Files
        });
        
        if (response.success) {
          // Create file states from server response
          const newFileStates = response.data.images.map((image: any) => ({
            file: null,
            preview: image.url,
            name: image.filename,
            size: image.size,
            isExisting: true,
            base64: image.url
          }));

          onFileChange(field.name, newFileStates);
        } else {
          alert("Failed to upload images: " + (response.message || "Unknown error"));
        }
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files. Please try again.");
    }
  };

  return (
    <div className="relative flex flex-col gap-6">
      <div
        className={cn(
          "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed",
          "border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25"
        )}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFiles = Array.from(e.dataTransfer.files);
          handleDrop(droppedFiles);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full border border-dashed p-3">
            <UploadIcon className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-px">
            <p className="font-medium text-muted-foreground">
              Drag 'n' drop files here, or click to select files
            </p>
            <p className="text-sm text-muted-foreground/70">
              You can upload up to {maxFiles}{" "}
              {maxFiles === 1 ? "file" : "files"}
              (max {formatBytes(maxSize)} each, total size limit: {formatBytes(MAX_TOTAL_SIZE)})
            </p>
          </div>
        </div>
        <Input
          type="file"
          onChange={(e) => handleDrop(Array.from(e.target.files || []))}
          multiple={maxFiles !== 1}
          accept="image/*"
          className="absolute w-full h-full inset-0 cursor-pointer opacity-0"
        />
      </div>
      {files?.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 rounded-md border p-4"
            >
              <img
                src={file.isExisting ? file.preview.url : file.preview}
                alt={file.isExisting ? "Existing image" : file.name}
                className="h-12 w-12 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {file.isExisting ? `Existing image ${index + 1}` : file.name}
                </p>
                {file.size && (
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onFileRemove(field.name, index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
