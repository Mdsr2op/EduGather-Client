import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="grid grid-cols-[auto,1fr] h-screen overflow-y-auto custom-scrollbar">
      {/* Sidebar section */}
      <Sidebar />
      {/* Main content section */}
      <div className="overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
