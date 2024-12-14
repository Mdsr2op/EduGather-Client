import { Routes, Route } from "react-router-dom";
import { SignInForm } from "./features/auth/components/SignInForm";
import { SignUpForm } from "./features/auth/components/SignUpForm";
import AuthLayout from "./features/auth/layout/AuthLayout";
import { Toaster } from "./components/ui/toaster";
import Home from "./components/pages/Home";

function App() {
  return (
    <main className="h-screen flex">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
        </Route>
        <Route index element={<Home />} />
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
