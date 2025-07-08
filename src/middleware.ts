import { defineMiddleware, sequence } from "astro:middleware";
import { serverApiService, type ApiResponse } from "./lib/utils/api";
import { CONSTANTS, ROUTES } from "./lib/utils/constants";

export const auth = defineMiddleware(
  async ({ cookies, redirect, locals, url }, next) => {
    // Allow public routes and API routes
    // if (
    //   PUBLIC_ROUTES.includes(url.pathname) ||
    //   API_ROUTES.includes(url.pathname)
    // ) {
    //   return next();
    // }

    // Check for access token
    const token = cookies.get(CONSTANTS.ACCESS_TOKEN_KEY);
    console.log("token in middleware ", token);
    if (!token) {
      if (url.pathname !== "/auth") {
        return redirect("/auth");
      }
    }

    try {
      // Validate token (you can add your token validation logic here)
      // For example, you could decode and verify the JWT token
      // const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

      // // Add user info to locals if needed
      // locals.user = decoded;

      // Allow the request to proceed

      const res: ApiResponse<{}> = await serverApiService.get(
        ROUTES.VERIFY_ME_ROUTE,
        token?.value || "",
        cookies
      );

      console.log("res in middleware ", res);
      if (res.success) {
        console.log('user is ',cookies.get(CONSTANTS.USER)?.value)
        
        locals.user = cookies.get(CONSTANTS.USER)?.value 
        if (url.pathname === "/auth" || url.pathname === "/") {
          return redirect("/admin/dashboard");
        }
      }

      const resp = await next();

      return resp;
    } catch (error) {
      console.log("error in middleware ", error);
      // If token is invalid, clear cookies and redirect to auth
      //   cookies.delete(CONSTANTS.ACCESS_TOKEN_KEY, { path: "/" });
      //   cookies.delete(CONSTANTS.REFRESH_TOKEN_KEY, { path: "/" });
      if (url.pathname !== "/auth") {
        return redirect("/auth");
      }
      return next();
    }
  }
);

export const onRequest = sequence(auth);
