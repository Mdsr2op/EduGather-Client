import { apiSlice } from "@/redux/api/apiSlice";

interface StreamTokenResponse {
  success: boolean;
  token: string;
  message?: string;
}

interface StreamKeyResponse {
  success: boolean;
  apiKey: string;
  message?: string;
}

export const streamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStreamToken: builder.query<StreamTokenResponse, void>({
      query: () => "/stream/token",
      transformResponse: (response: { success: boolean; token: string; message?: string }) => {
        return response;
      },
    }),
    fetchStreamToken: builder.mutation<StreamTokenResponse, void>({
      query: () => ({
        url: "/stream/token",
        method: "GET",
      }),
    }),
    getStreamKey: builder.query<StreamKeyResponse, void>({
      query: () => "/stream/key",
      transformResponse: (response: { success: boolean; apiKey: string; message?: string }) => {
        return response;
      },
    }),
  }),
});

export const { 
  useGetStreamTokenQuery, 
  useFetchStreamTokenMutation,
  useGetStreamKeyQuery 
} = streamApiSlice; 