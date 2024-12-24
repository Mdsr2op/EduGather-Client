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

function App() {
  return (
    <main className="h-screen flex">
      <Routes>
        <Route index path="/home" element={<Home />} />

        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<RootLayout />}>
            {/* ChatPage Route with groupId and channelId */}
            <Route path="/:groupId/:channelId" element={<ChatPage />} />

            {/* New Routes */}
            <Route path="/discover-groups" element={<DiscoverGroups />} />
            <Route path="/scheduled-meetings" element={<ScheduledMeetings />} />
            <Route path="/ai-quiz-generation" element={<AiQuizGeneration />} />
            <Route path="/meeting-recordings" element={<MeetingRecordings />} />

            {/* Optional: Redirect root path to a default group and channel */}
            <Route
              path="/"
              element={<Navigate to="/defaultGroupId/defaultChannelId" replace />}
            />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
        

      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
