// App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./components/pages/ChatPage";
import Home from "./components/pages/Home";
import { Toaster } from "./components/ui/toaster";
import { SignInForm } from "./features/auth/components/SignInForm";
import { SignUpForm } from "./features/auth/components/SignUpForm";
import AuthLayout from "./features/auth/layout/AuthLayout";
import RootLayout from "./features/root/layout/RootLayout";
import RequireAuth from "./features/auth/components/RequireAuth";
import MeetingRecordings from "./components/pages/MeetingRecordings";
import AiQuizGeneration from "./components/pages/AIQuizGeneration";
import ScheduledMeetings from "./components/pages/ScheduledMeetings";
import DiscoverGroups from "./components/pages/DiscoverGroups";
import { useGetCurrentUserQuery } from "./features/auth/slices/authApiSlice";
import { SocketProvider } from "./lib/socket";

function App() {
  const { isLoading, isError } = useGetCurrentUserQuery();

  // The rest of your routes
  return (
    <SocketProvider>
      <main className="h-screen flex">
        {isLoading ? (
          <p>Loading user session...</p>
        ) : (
          <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>

              <Route path="/sign-up" element={<SignUpForm />} />
              <Route path="/sign-in" element={<SignInForm />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              <Route element={<RootLayout />}>
                <Route path="/landing" element={<Home />} /> {/* Home/Landing Page */}
                
                {/* Group and Chat Routes */}
                <Route path="/:groupId/channels" element={<ChatPage />} /> {/* Group without channel */}
                <Route path="/:groupId/:channelId" element={<ChatPage />} /> {/* Group with channel */}

                {/* Additional Protected Routes */}
                <Route path="/discover-groups" element={<DiscoverGroups />} />
                <Route
                  path="/scheduled-meetings"
                  element={<ScheduledMeetings />}
                />
                <Route
                  path="/ai-quiz-generation"
                  element={<AiQuizGeneration />}
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
        )}
        <Toaster />
      </main>
    </SocketProvider>
  );
}

export default App;
