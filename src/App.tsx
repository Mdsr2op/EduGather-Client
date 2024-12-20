import { Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./components/pages/ChatPage";
import Home from "./components/pages/Home";
import { Toaster } from "./components/ui/toaster";
import { SignInForm } from "./features/auth/components/SignInForm";
import { SignUpForm } from "./features/auth/components/SignUpForm";
import AuthLayout from "./features/auth/layout/AuthLayout";
import RootLayout from "./features/root/layout/RootLayout";
import RequireAuth from "./features/auth/components/RequireAuth";

function App() {
  return (
    <main className="h-screen flex">
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<ChatPage />} />

          </Route>
        </Route>

        {/* Fallback Route (Optional) */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
