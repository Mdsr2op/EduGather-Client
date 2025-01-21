import React, { useEffect } from "react";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "../slices/authSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
