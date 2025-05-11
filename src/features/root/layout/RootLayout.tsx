import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GroupContextMenu from "../groups/components/GroupContextMenu";
import { 
  selectGroupContextMenu, 
  closeContextMenu,
  openContextMenu
} from "../groups/slices/groupSlice";
import { useGetJoinedGroupsQuery } from "../groups/slices/groupApiSlice";
import { AuthState } from "@/features/auth/slices/authSlice";
import { useSocket } from "@/lib/socket";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { connectToChannel } = useSocket();
  
  // Group context menu from Redux
  const groupContextMenu = useSelector(selectGroupContextMenu);
  
  // Logged-in user
  const userId = useSelector(
    (state: { auth: AuthState }) => state.auth.user?._id ?? ""
  );
  
  // Fetch joined groups to get group details
  const { data: joinedGroups = [] } = useGetJoinedGroupsQuery(userId, { 
    skip: !userId 
  });

  // Connect to socket for notifications when the layout mounts
  useEffect(() => {
    if (userId) {
      // Use any group ID the user belongs to, or a special notifications channel
      // For notifications, we set isNotification to true
      const notificationChannelId = joinedGroups[0]?._id || 'notifications';
      connectToChannel(notificationChannelId, userId, true);
      console.log('Connected to socket for notifications');
    }
  }, [userId, joinedGroups, connectToChannel]);

  // Check for mobile screen size on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Context menu handlers
  const handleGroupContextMenu = (e: React.MouseEvent, groupId: string) => {
    e.preventDefault();
    dispatch(
      openContextMenu({
        position: { x: e.pageX, y: e.pageY },
        groupId,
      })
    );
  };

  const handleCloseContextMenu = () => {
    dispatch(closeContextMenu());
  };

  const handleContextMenuAction = (action: string) => {
    // Pass the action back to the Sidebar through a custom event
    const event = new CustomEvent('group-context-menu-action', { 
      detail: { action, groupId: groupContextMenu.groupId } 
    });
    document.dispatchEvent(event);
    handleCloseContextMenu();
  };
  
  // Find the current group under context menu
  const currentGroup = joinedGroups.find(g => g._id === groupContextMenu.groupId);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Mobile menu button - positioned in top-right for better placement */}
      <button 
        className="md:hidden fixed top-4 right-4 z-[100] bg-dark-3 p-2.5 rounded-full shadow-lg hover:bg-dark-4 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? (
          <FiX size={24} className="text-light-1" />
        ) : (
          <FiMenu size={24} className="text-light-1" />
        )}
      </button>

      {/* Overlay for mobile - closes sidebar when clicking outside */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - fixed on desktop, drawer on mobile */}
      <div 
        className={`
          md:w-auto md:relative
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out shadow-xl' : 'relative'}
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <Sidebar 
          onCloseDrawer={() => setIsSidebarOpen(false)} 
          onGroupContextMenu={handleGroupContextMenu}
          onCloseContextMenu={handleCloseContextMenu}
        />
      </div>

      {/* Main content section */}
      <div className="overflow-y-auto custom-scrollbar w-full h-full md:ml-0">
        <Outlet />
      </div>

      {/* Group Context Menu - Positioned at the root level */}
      {groupContextMenu.isOpen && currentGroup && (
        <GroupContextMenu
          group={currentGroup}
          position={groupContextMenu.position}
          onClose={handleCloseContextMenu}
          onAction={handleContextMenuAction}
        />
      )}
    </div>
  );
};

export default Layout;
