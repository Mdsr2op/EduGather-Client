
import React from "react";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentToken } from "../slices/authSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth: React.FC = () => {
  const token = useAppSelector(selectCurrentToken);
  const isAuthenticated = Boolean(token);
  const location = useLocation();

  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
