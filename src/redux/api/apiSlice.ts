import { logOut } from "@/features/auth/slices/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/v1",
  credentials: "include", // ensure cookies are included
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // If 401 or 403 => try refresh
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    console.log("Attempting token refresh...");

    // Attempt token refresh
    const refreshResult = await baseQuery(
      {
        url: "/users/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // If refresh succeeded, try the original query again
      console.log("Refresh succeeded. Retrying original request.");
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If refresh also fails, force logout
      console.log("Refresh failed. Logging out.");
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Groups", "Channels", "Messages"],
  endpoints: () => ({}),
});
