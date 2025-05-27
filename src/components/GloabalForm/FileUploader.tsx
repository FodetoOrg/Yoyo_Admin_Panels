import { UploadIcon, X } from "lucide-react";

import { formatBytes } from "./utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

interface FileState {
  file: File | null;
  preview: string;
  name?: string;
  size?: number;
  isExisting?: boolean;
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

export const FileUploader = ({
  field,
  onFileChange,
  onFileRemove,
  files = [],
}: FileUploaderProps) => {
  const maxSize = field.maxFileSize || 1024 * 1024 * 2; // 2MB default
  const maxFiles = field.maxFiles || 1;

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length + files.length > maxFiles) {
      // toast.error(`Cannot upload more than ${maxFiles} files`);
      return;
    }

    // Validate file sizes
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > maxSize) {
        // toast.error(`File ${file.name} is larger than ${formatBytes(maxSize)}`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newFileStates = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        isExisting: false,
      }));


      onFileChange(field.name, newFileStates);
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
              (max {formatBytes(maxSize)} each)
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
                src={file.preview}
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
