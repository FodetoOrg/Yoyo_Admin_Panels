import { defineMiddleware, sequence } from "astro:middleware";
import { serverApiService, type ApiResponse } from "./lib/utils/api";
import { CONSTANTS, ROUTES } from "./lib/utils/constants";

export const auth = defineMiddleware(
  async ({ cookies, redirect, locals, url }, next) => {
    // Check for access token
    const token = cookies.get(CONSTANTS.ACCESS_TOKEN_KEY);
    
    if (!token) {
      if (url.pathname !== "/auth") {
        return redirect("/auth");
      }
      return next();
    }

    try {
      const res: ApiResponse<{}> = await serverApiService.get(
        ROUTES.VERIFY_ME_ROUTE,
        token?.value || "",
        cookies
      );

      if (res.success) {
        const userCookie = cookies.get(CONSTANTS.USER)?.value;
        if (userCookie) {
          try {
            locals.user = JSON.parse(userCookie);
          } catch (e) {
            console.error("Error parsing user cookie:", e);
            cookies.delete(CONSTANTS.ACCESS_TOKEN_KEY);
            cookies.delete(CONSTANTS.REFRESH_TOKEN_KEY);
            cookies.delete(CONSTANTS.USER);
            return redirect("/auth");
          }
        }
        
        if (url.pathname === "/auth" || url.pathname === "/") {
          return redirect("/admin/dashboard");
        }
      }

      return next();
    } catch (error) {
      console.error("Middleware error:", error);
      cookies.delete(CONSTANTS.ACCESS_TOKEN_KEY);
      cookies.delete(CONSTANTS.REFRESH_TOKEN_KEY);
      cookies.delete(CONSTANTS.USER);
      if (url.pathname !== "/auth") {
        return redirect("/auth");
      }
      return next();
    }
  }
);

export const onRequest = sequence(auth);
