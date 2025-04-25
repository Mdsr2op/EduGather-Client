import { useAppSelector } from "@/redux/hook";
import { Outlet, Navigate } from "react-router-dom";
import { selectCurrentUser } from "../slices/authSlice";

const AuthLayout = () => {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = !!user;

  console.log(isAuthenticated);
  return isAuthenticated ? (
    <Navigate to="/discover-groups" />
  ) : (
    <section className="flex flex-1 justify-center items-center flex-col py-6 px-4 overflow-hidden">
      <Outlet />
    </section>
  );
};

export default AuthLayout;
