import { apiSlice } from "@/redux/api/apiSlice";
import { 
  NotificationResponse, 
  NotificationReadResponse, 
  AllNotificationsReadResponse 
} from "../types";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationResponse, { page?: number; limit?: number }>({
      query: (params = { page: 1, limit: 10 }) => ({
        url: '/notifications',
        method: 'GET',
        params,
      }),
      providesTags: ['Notifications'],
    }),

    markNotificationAsRead: builder.mutation<NotificationReadResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),

    markAllNotificationsAsRead: builder.mutation<AllNotificationsReadResponse, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApiSlice; 