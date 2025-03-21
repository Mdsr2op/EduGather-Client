import { apiSlice } from "@/redux/api/apiSlice";
import { setStreamApiKey, setStreamToken, setStreamUser } from "./streamSlice";

export interface StreamConfig {
  apiKey: string;
}

export interface StreamTokenResponse {
  data: {
    token: string;
  };
}

export interface StreamUserResponse {
  data: {
    user: {
      id: string;
      name: string;
      username: string;
      image: string;
      email: string;
    };
  };
}

// Define the Stream API endpoints
export const streamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStreamConfig: builder.query<StreamConfig, void>({
      query: () => "/stream/config",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // The backend returns { apiKey: "your-stream-api-key" }
          dispatch(setStreamApiKey(data.apiKey));
        } catch (err) {
          console.error("Error fetching Stream config:", err);
        }
      },
    }),
    
    getStreamToken: builder.query<StreamTokenResponse, void>({
      query: () => "/stream/token",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // The backend returns { data: { token: "your-stream-token" } }
          dispatch(setStreamToken(data.data.token));
        } catch (err) {
          console.error("Error fetching Stream token:", err);
        }
      },
    }),
    
    createUpdateStreamUser: builder.mutation<StreamUserResponse, void>({
      query: () => ({
        url: "/stream/user",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // The backend returns { data: { user: { id, name, username, image, email } } }
          dispatch(setStreamUser(data.data.user));
        } catch (err) {
          console.error("Error creating/updating Stream user:", err);
        }
      },
    }),
  }),
});

export const {
  useGetStreamConfigQuery,
  useGetStreamTokenQuery,
  useCreateUpdateStreamUserMutation,
} = streamApiSlice;
