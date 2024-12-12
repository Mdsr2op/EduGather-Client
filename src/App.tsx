import { Routes, Route } from "react-router-dom";
import { SignInForm } from "./features/auth/components/SignInForm";
import { SignUpForm } from "./features/auth/components/SignUpForm";
import AuthLayout from "./features/auth/layout/AuthLayout";
import { Button } from "./components/ui/button";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
      </Route>
      <Route index element={<Button>Click me</Button>}/>
    </Routes>
  );
}

export default App;
