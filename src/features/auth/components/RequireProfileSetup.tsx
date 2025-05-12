import React from "react";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "../slices/authSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireProfileSetup: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();

  // If no user, redirect to landing page
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user has username equal to email or it's empty/missing, redirect to complete profile
  if (!user.username || user.username === user.email) {
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }

  // User has completed profile setup, allow access to protected routes
  return <Outlet />;
};

export default RequireProfileSetup; 