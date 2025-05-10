// App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./components/pages/ChatPage";
import Home from "./components/pages/Home";
import { SignInForm } from "./features/auth/components/SignInForm";
import { SignUpForm } from "./features/auth/components/SignUpForm";
import { ForgotPasswordForm } from "./features/auth/components/ForgotPasswordForm";
import { GoogleAuthCallback } from "./features/auth/components/GoogleAuthCallback";
import AuthLayout from "./features/auth/layout/AuthLayout";
import RootLayout from "./features/root/layout/RootLayout";
import RequireAuth from "./features/auth/components/RequireAuth";
import MeetingRecordings from "./components/pages/MeetingRecordings";
import ScheduledMeetings from "./components/pages/ScheduledMeetings";
import DiscoverGroups from "./components/pages/DiscoverGroups";
import MeetingPage from "./components/pages/MeetingPage";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import TermsAndConditions from "./components/pages/TermsAndConditions";
import { useGetCurrentUserQuery } from "./features/auth/slices/authApiSlice";
import { SocketProvider } from "./lib/socket";
import StreamVideoProvider from "./providers/StreamVideoProvider";
import ToastProvider from "./components/ToastProvider";
import NotificationsPage from "./components/pages/NotificationsPage";
import JoinGroupRedirect from "./features/root/groups/components/JoinGroupRedirect";

function App() {
  const { isLoading } = useGetCurrentUserQuery();

  return (
    <ToastProvider>
      <SocketProvider>
        <main className="h-screen flex">
          {isLoading ? (
            <p>Loading user session...</p>
          ) : (
            <StreamVideoProvider>
              <Routes>
                {/* Public Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/sign-up" element={<SignUpForm />} />
                  <Route path="/sign-in" element={<SignInForm />} />
                  <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                  <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
                </Route>

                {/* Legal Pages - Public Access */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

                {/* Protected Routes */}
                <Route element={<RequireAuth />}>
                  {/* Group Join Route */}
                  <Route path="/groups/join/:groupId" element={<JoinGroupRedirect />} />
                  
                  <Route element={<RootLayout />}>
                    <Route path="/landing" element={<Home />} /> {/* Home/Landing Page */}
                    
                    {/* Group and Chat Routes */}
                    <Route path="/:groupId/channels" element={<ChatPage />} /> {/* Group without channel */}
                    <Route path="/:groupId/:channelId" element={<ChatPage />} /> {/* Group with channel */}
                    
                    {/* Meeting Route */}
                    <Route path="/:groupId/:channelId/meeting/:id" element={<MeetingPage />} />

                    {/* Additional Protected Routes */}
                    <Route path="/discover-groups" element={<DiscoverGroups />} />
                    <Route
                      path="/scheduled-meetings"
                      element={<ScheduledMeetings />}
                    />
                    <Route
                      path="/notifications"
                      element={<NotificationsPage />}
                    />
                    <Route
                      path="/meeting-recordings"
                      element={<MeetingRecordings />}
                    />

                    {/* Default Protected Route */}
                    <Route
                      index
                      element={<Navigate to="/discover-groups" replace />}
                    />
                  </Route>
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </StreamVideoProvider>
          )}
        </main>
      </SocketProvider>
    </ToastProvider>
  );
}

export default App;
