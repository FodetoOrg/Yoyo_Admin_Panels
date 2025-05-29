import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date;
  } catch (error) {
    console.error("Error converting string to date:", error);
    return null;
  }
}

export function redirectToNotFound(
  Astro: any,
  title: string,
  description: string,
  pageRedirect: string,
  pageRedirectText: string,
  previousPage?: string
) {
  const redirectUrl = new URL("/NotFound", Astro.url.origin);
  redirectUrl.searchParams.set("title", title);
  redirectUrl.searchParams.set("description", description);
  redirectUrl.searchParams.set("pageRedirect", pageRedirect);
  redirectUrl.searchParams.set("pageRedirectText", pageRedirectText);
  if (previousPage) {
    redirectUrl.searchParams.set("previousPage", previousPage);
  }
  return Astro.redirect(redirectUrl.toString());
}
