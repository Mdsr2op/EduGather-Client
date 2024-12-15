import { useAppSelector } from "@/redux/hook";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentToken } from "../slices/authSlice";

const AuthLayout = () => {
    const token = useAppSelector(selectCurrentToken);
  const isAuthenticated = !!token;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <section className="flex flex-1 justify-center items-center flex-col py-6 px-4 overflow-hidden">
          <Outlet />
        </section>
      )}
    </>
  );
};

export default AuthLayout;
