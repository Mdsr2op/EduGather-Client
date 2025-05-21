import { useAppSelector } from "@/redux/hook";
import { Outlet, Navigate } from "react-router-dom";
import { selectCurrentUser } from "../slices/authSlice";

const AuthLayout = () => {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = !!user;

  // Removed console log
  return isAuthenticated ? (
    <Navigate to="/home" />
  ) : (
    <section className="flex flex-1 justify-center items-center flex-col py-6 px-4 overflow-hidden bg-dark-1 dark:bg-dark-1 light:bg-light-bg-2 min-h-screen w-full transition-colors duration-200">
      <Outlet />
    </section>
  );
};

export default AuthLayout;
