import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function stringToDate(dateString: string) {
  try{
    const date = new Date(dateString);
    return date;
  }catch(error){
    console.error("Error converting string to date:", error);
    return null;
  }
}


