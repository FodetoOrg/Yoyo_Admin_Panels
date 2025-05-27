import type { z } from "zod";

export interface FieldConfig {
  isSearchable?: boolean;
  name: string;
  type:
    | "input"
    | "textarea"
    | "select"
    | "multiselect"
    | "file"
    | "dynamicGroup";
  validation?: z.ZodType<any>;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string | boolean }[];
  space?: number;
  maxFiles?: number;
  maxFileSize?: number;
  dynamicFields?: FieldConfig[];
  editable?: boolean;
  inputType?: string;
}

export interface FormConfig {
  title: string;
  fields: FieldConfig[];
  columns?: number;
  onSubmit: (values: any, isUpdate: boolean) => Promise<any>;
  onFileUpload?: (file: File[]) => Promise<string[]>;
  defaultValues?: any;
  onsuccess?:string
}
