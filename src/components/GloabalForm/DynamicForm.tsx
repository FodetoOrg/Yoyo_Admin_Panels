import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SearchableSelect } from "./SearchableSelect";
import type { FieldConfig, FormConfig } from "@/lib/types";
import { FileUploader } from "./FileUploader";
import { SearchableMultiSelect } from "./SearchableMultiSelect";
import { getColumnClass, getGridClass, validateFiles } from "./utils";
// import { toast } from "sonner";

interface FileState {
  file: File | null;
  preview: string;
  name?: string;
  size?: number;
  isExisting?: boolean;
}

const DynamicForm = ({
  config: {
    title,
    fields,
    columns = 2,
    onSubmit,
    onFileUpload,
    defaultValues = null,
    onsuccess = "",
  },
}: {
  config: FormConfig;
}) => {
  const [fileStates, setFileStates] = useState<Record<string, FileState[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicGroups, setDynamicGroups] = useState<Record<string, number[]>>(
    {}
  );

  React.useEffect(() => {
    const initialGroups: Record<string, number[]> = {};
    fields.forEach((field) => {
      if (field.type === "dynamicGroup") {
        const defaultGroupLength = defaultValues?.[field.name]?.length || 1;
        initialGroups[field.name] = Array.from(
          { length: defaultGroupLength },
          (_, i) => i
        );
      }
    });
    setDynamicGroups(initialGroups);
  }, [fields, defaultValues]);

  useEffect(() => {
    if (defaultValues) {
      console.log("defaultValues ", defaultValues);
      const initialFileStates: Record<string, FileState[]> = {};
      fields.forEach((field) => {
        if (field.type === "file" && defaultValues[field.name]) {
          initialFileStates[field.name] = (
            defaultValues[field.name] as string[]
          ).map((url) => ({
            file: null,
            preview: url,
            isExisting: true,
          }));
        }
      });
      setFileStates(initialFileStates);
    }
  }, [defaultValues, fields]);

  const handleFileChange = (fieldName: string, newFiles: FileState[]) => {
    setFileStates((prev) => {
      const existingFiles = prev[fieldName] || [];
      const newFileStates = newFiles.map((filestate) => ({
        file: filestate.file,
        preview: URL.createObjectURL(filestate?.file),
        isExisting: false,
      }));

      return {
        ...prev,
        [fieldName]: [...existingFiles, ...newFileStates],
      };
    });
  };

  const removeFile = (fieldName: string, index: number) => {
    setFileStates((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const createSchema = () => {
    const schemaObject: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === "dynamicGroup") {
        const groupSchema: Record<string, any> = {};
        const groupIndices = dynamicGroups[field.name] || [0];
        field.dynamicFields?.forEach((subField) => {
          groupIndices.forEach((index) => {
            groupSchema[`${subField.name}_${index}`] = subField.validation;
          });
        });
        schemaObject[field.name] = z.object(groupSchema);
      } else if (field.name.includes(".")) {
        // For nested fields like "storeAddress.street"
        const [parentKey, childKey] = field.name.split(".");

        // Ensure the parent schema is an object
        if (!schemaObject[parentKey]) {
          schemaObject[parentKey] = z.object({});
        }

        // Append child validation
        schemaObject[parentKey] = schemaObject[parentKey].extend({
          [childKey]: field.validation,
        });
      } else {
        schemaObject[field.name] = field.validation;
        schemaObject[field.name] =
          field.inputType === "number"
            ? field.validation.pipe(z.coerce.number())
            : field.validation;
      }
    });

    return z.object(schemaObject);
  };

  const formSchema = createSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      ...(defaultValues &&
        Object.fromEntries(
          fields
            .filter((field) => field.type === "dynamicGroup")
            .map((field) => {
              const groupValues = defaultValues[field.name] || [];
              const transformedGroup = {};

              groupValues.forEach((item: any, index: number) => {
                field.dynamicFields?.forEach((subField) => {
                  transformedGroup[`${subField.name}_${index}`] =
                    item[subField.name];
                });
              });

              return [field.name, transformedGroup];
            })
        )),
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("dynamic form ", values);
      setIsSubmitting(true);
      const fileFields = fields.filter((f) => f.type === "file");
      console.log("files are ", fileFields);
      const uploadPromises = fileFields.map(async (field) => {
        const fieldFiles = fileStates[field.name] || [];
        console.log(fieldFiles);
        // Only upload new files
        const filesToUpload = fieldFiles
          .filter((fileState) => !fileState.isExisting && fileState.file)
          .map((fileState) => fileState.file!);
        console.log("filesToUpload ", filesToUpload);
        let uploadedUrls: string[] = [];
        if (filesToUpload.length > 0) {
          uploadedUrls = (await onFileUpload?.(filesToUpload)) || [];
          // return
          if (uploadedUrls.length === 0) {
           
            // toast("Unable to do action", {
            //   description: "Please try after sometime/try to contact company",
            // });
            return;
          }
        }
        console.log("uploadedUrls ", uploadedUrls);
        // Combine existing URLs with new uploaded URLs
        const allUrls = fieldFiles
          .map((fileState) =>
            !fileState.isExisting ? uploadedUrls.shift() : fileState.preview
          )
          .filter(Boolean) as string[];

        return { [field.name]: allUrls };
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const fileUrls = uploadedUrls.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );

      // Transform dynamic group values into a more usable format
      const transformedValues = { ...values };
      fields.forEach((field) => {
        if (field.type === "dynamicGroup") {
          const groupData: any[] = [];
          const indices = dynamicGroups[field.name] || [0];
          indices.forEach((index) => {
            const groupItem: any = {};
            field.dynamicFields?.forEach((subField) => {
              groupItem[subField.name] =
                transformedValues[field.name][`${subField.name}_${index}`];
            });
            groupData.push(groupItem);
          });
          transformedValues[field.name] = groupData;
        }
      });

      const resp = await onSubmit(
        { ...transformedValues, ...fileUrls },
        defaultValues ? true : false
      );
      if (resp.data.success) {
        // toast("success", {
        //   description: "Friday, February 10, 2023 at 5:57 PM",
        // });

        if (onsuccess) {
          window.location.href = onsuccess;
        }
      } else {
        // toast("Unable to do action", {
        //   description: resp.data.message,
        // });
      }

      if (resp.data.success) {
        const initialGroups: Record<string, number[]> = {};
        fields.forEach((field) => {
          if (field.type === "dynamicGroup") {
            initialGroups[field.name] = [0];
          }
        });
        setDynamicGroups(initialGroups);
        // window.location.href = "/dashboard/categories";
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDynamicGroup = (fieldName: string) => {
    setDynamicGroups((prev) => {
      const currentIndices = prev[fieldName] || [0];
      const newIndex = Math.max(...currentIndices) + 1;
      return {
        ...prev,
        [fieldName]: [...currentIndices, newIndex],
      };
    });
  };

  const removeDynamicGroup = (fieldName: string, indexToRemove: number) => {
    setDynamicGroups((prev) => {
      const currentIndices = prev[fieldName] || [0];
      if (currentIndices.length <= 1) return prev; // Maintain minimum of 1 group

      const newIndices = currentIndices.filter(
        (index) => index !== indexToRemove
      );
      return {
        ...prev,
        [fieldName]: newIndices,
      };
    });

    // Clear form values for removed group
    const fieldsToClear: string[] = [];
    fields
      .find((f) => f.name === fieldName)
      ?.dynamicFields?.forEach((subField) => {
        fieldsToClear.push(`${fieldName}.${subField.name}_${indexToRemove}`);
      });

    fieldsToClear.forEach((fieldName) => {
      form.unregister(fieldName);
    });
  };

  const renderDynamicGroup = (field: FieldConfig) => {
    const indices = dynamicGroups[field.name] || [0];
    const defaultGroupValues = defaultValues?.[field.name] || [];

    return (
      <div className={`grid ${getGridClass(columns)} gap-6`}>
        {indices.map((index) => {
          const defaultValue = defaultGroupValues[index] || {};
          return (
            <div
              key={`${field.name}_${index}`}
              className={`${getColumnClass(field.space)}   rounded-lg relative`}
            >
              <div className="flex gap-4 flex-wrap">
                {field.dynamicFields?.map((subField) => (
                  <FormField
                    key={`${subField.name}_${index}`}
                    control={form.control}
                    name={`${field.name}.${subField.name}_${index}`}
                    // defaultValue={defaultValue[subField.name]}
                    render={({ field: formField }) => (
                      <FormItem
                        className={`flex-1 min-w-[200px] ${getColumnClass(
                          subField.space
                        )}`}
                      >
                        <FormLabel>{subField.label}</FormLabel>
                        <FormControl>
                          {renderFormControl(subField, formField)}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="absolute bottom-0 right-0 flex gap-2">
                {indices.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-red-500"
                    onClick={() => removeDynamicGroup(field.name, index)}
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                )}
                {index === Math.max(...indices) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-zinc-800 text-white"
                    onClick={() => addDynamicGroup(field.name)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFormControl = (field: FieldConfig, formField: any) => {
    const isEditable = field.editable !== false;
    const commonProps = {
      ...formField,
      disabled: !isEditable,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "dynamicGroup":
        return renderDynamicGroup(field);
      case "input":
        return (
          <Input
            {...commonProps}
            type={field.inputType || "text"}
            onChange={(e) => {
              const value =
                field.inputType === "number"
                  ? e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                  : e.target.value;
              formField.onChange(value);
            }}
          />
        );
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            className={`resize-none ${!isEditable ? "opacity-75" : ""}`}
          />
        );
      case "multiselect":
        return (
          <SearchableMultiSelect
            field={field}
            value={formField.value}
            onChange={formField.onChange}
            options={field.options || []}
          />
        );

      case "file":
        return (
          <FileUploader
            field={field}
            onFileChange={handleFileChange}
            onFileRemove={removeFile}
            files={fileStates[field.name] || []}
          />
        );

      case "select":
        return field.isSearchable ? (
          <SearchableSelect
            field={field}
            value={formField.value}
            onChange={isEditable ? formField.onChange : undefined}
            options={field.options || []}
            placeholder={field.placeholder}
            disabled={!isEditable}
          />
        ) : (
          <Select
            onValueChange={isEditable ? formField.onChange : undefined}
            value={formField.value}
            disabled={!isEditable}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className={`grid gap-6 ${getGridClass(columns)}`}>
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={`col-span-1 ${getColumnClass(field.space)}`}
                >
                  {field.type === "dynamicGroup" ? (
                    <div className="space-y-2">
                      <h3 className="font-medium">{field.label}</h3>
                      {renderDynamicGroup(field)}
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            {renderFormControl(field, formField)}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DynamicForm;
