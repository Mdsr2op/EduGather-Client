import { Routes, Route } from "react-router-dom";
import { SignInForm } from "./features/auth/components/SignInForm";
import { SignUpForm } from "./features/auth/components/SignUpForm";
import AuthLayout from "./features/auth/layout/AuthLayout";
import RootLayout from "./features/root/layout/RootLayout";
import { Toaster } from "./components/ui/toaster";
import Home from "./components/pages/Home";
import { Button } from "./components/ui/button";
import ChatPage from "./components/pages/ChatPage";

function App() {
  return (
    <main className="h-screen flex">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route index path="/home" element={<Home />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route path="/" element={<ChatPage />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
