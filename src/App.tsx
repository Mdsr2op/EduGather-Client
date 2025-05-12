// App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./components/pages/ChatPage";
import Home from "./components/pages/Home";
import { SignInForm } from "./features/auth/components/SignInForm";
import { SignUpForm } from "./features/auth/components/SignUpForm";
import { ForgotPasswordForm } from "./features/auth/components/ForgotPasswordForm";
import { GoogleAuthCallback } from "./features/auth/components/GoogleAuthCallback";
import { GoogleProfileCompletionPage } from "./features/auth/pages/GoogleProfileCompletionPage";
import AuthLayout from "./features/auth/layout/AuthLayout";
import RootLayout from "./features/root/layout/RootLayout";
import RequireAuth from "./features/auth/components/RequireAuth";
import RequireProfileSetup from "./features/auth/components/RequireProfileSetup";
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
import LandingPage from "./components/pages/LandingPage";

// Wrapper for the profile completion page to center it properly
const CenteredProfileCompletion = () => (
  <div className="flex items-center justify-center min-h-screen w-full">
    <GoogleProfileCompletionPage />
  </div>
);

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
                <Route path="/" element={<LandingPage />} /> {/* Landing page as default route */}
                
                <Route element={<AuthLayout />}>
                  <Route path="/sign-up" element={<SignUpForm />} />
                  <Route path="/sign-in" element={<SignInForm />} />
                  <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                  <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
                </Route>

                {/* Google Profile Completion - Special Auth Route with custom centered layout */}
                <Route path="/complete-profile" element={<CenteredProfileCompletion />} />

                {/* Legal Pages - Public Access */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

                {/* Protected Routes - First check if authenticated */}
                <Route element={<RequireAuth />}>
                  {/* Then check if profile setup is completed */}
                  <Route element={<RequireProfileSetup />}>
                    {/* Group Join Route */}
                    <Route path="/groups/join/:groupId" element={<JoinGroupRedirect />} />
                    
                    <Route element={<RootLayout />}>
                      <Route path="/home" element={<Home />} /> {/* Home dashboard */}
                      
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

                      {/* Default Route for Authenticated Users */}
                      <Route
                        index
                        element={<Navigate to="/home" replace />}
                      />
                    </Route>
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
