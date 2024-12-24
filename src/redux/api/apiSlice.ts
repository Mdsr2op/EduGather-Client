import { logOut, setCredentials } from "@/features/auth/slices/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/v1/",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 403 error, try to refresh the token
  if (result?.error && (result.error as any).originalStatus === 403) {
    console.log("sending refresh token");
    // Attempt to get a new access token
    const refreshResult = await baseQuery("/refresh", api, extraOptions);
    console.log(refreshResult);
    if (refreshResult?.data) {
      const { user } = (api.getState() as RootState).auth;
      // The refresh endpoint should return a new access token
      const data = refreshResult.data as { accessToken: string };
      api.dispatch(
        setCredentials({ user: user!, accessToken: data.accessToken })
      );
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Groups"],
  endpoints: () => ({}),
});
