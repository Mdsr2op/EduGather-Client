import ChannelSidebar from "@/features/root/channels/components/ChannelSidebar";
import { useGetChannelsQuery } from "@/features/root/channels/slices/channelApiSlice";
import {
  selectSelectedChannelId,
  setSelectedChannelId,
} from "@/features/root/channels/slices/channelSlice";
import ChatHeader from "@/features/root/chats/components/ChatHeader";
import ChatWindow from "@/features/root/chats/components/ChatWindow";
import { useGetGroupDetailsQuery } from "@/features/root/groups/slices/groupApiSlice";
import {
  selectSelectedGroupId,
  selectNavigationSource,
  setNavigationSource,
} from "@/features/root/groups/slices/groupSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function ChatPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const selectedGroupId = useSelector(selectSelectedGroupId);
  const navigationSource = useSelector(selectNavigationSource);
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const userId = useSelector((state: any) => state.auth.user?._id) || "";
  const [showSidebar, setShowSidebar] = useState(true);

  // Note: We're removing the redirects based on selectedGroupId to stop unwanted navigation
  // Reset the navigation source if it's set
  useEffect(() => {
    if (navigationSource === "user_action") {
      dispatch(setNavigationSource(null));
    }
  }, [navigationSource, dispatch]);

  // Get group details to show member count
  const { data: groupDetails } = useGetGroupDetailsQuery(groupId || "", {
    skip: !groupId,
  });

  // Get channels for the current group
  const {
    data: channelsData,
    isLoading: isLoadingChannels,
    isError: isChannelsError,
  } = useGetChannelsQuery(groupId || "", {
    skip: !groupId,
  });

  // Extract data
  const channels = channelsData?.data?.channels || [];
  const selectedChannel = channels.find((ch) => ch._id === selectedChannelId);
  const membersCount = groupDetails?.members?.length || 0;

  // Reset selectedChannelId when groupId changes
  useEffect(() => {
    dispatch(setSelectedChannelId(null));
  }, [groupId, dispatch]);

  // Handle no selected channel
  useEffect(() => {
    if (groupId && !selectedChannelId) {
      navigate(`/${groupId}/channels`);
    }
  }, [groupId, selectedChannelId, navigate]);

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Loading state
  if (isLoadingChannels) {
    return (
      <div className="flex h-[100dvh] max-h-[100dvh] overflow-y-auto overflow-x-hidden custom-scrollbar bg-dark-4 text-white">
        {groupId && (
          <div className="w-full lg:w-auto">
            <ChannelSidebar groupId={groupId} />
          </div>
        )}
        <div className="flex-grow p-4 bg-dark-3 rounded-xl items-center justify-center hidden lg:flex">
          <div className="text-light-2">Loading channel data...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (isChannelsError && selectedChannelId) {
    return (
      <div className="flex h-[100dvh] max-h-[100dvh] overflow-y-auto overflow-x-hidden custom-scrollbar bg-dark-4 text-white">
        {groupId && (
          <div className="w-full lg:w-auto">
            <ChannelSidebar groupId={groupId} />
          </div>
        )}
        <div className="flex-grow p-4 bg-dark-3 rounded-xl items-center justify-center hidden lg:flex">
          <div className="text-red-500">
            Error loading channel data. Please try again.
          </div>
        </div>
      </div>
    );
  }

  // No selected channel - show only the message without chat layout
  if (!selectedChannelId) {
    const arrowStyle = {
      animation: "bounceLeft 1s infinite",
    };

    return (
      <div className="flex h-[100dvh] max-h-[100dvh] overflow-y-auto overflow-x-hidden custom-scrollbar bg-dark-4 text-white">
        {groupId && (
          <div
            className={`w-full lg:w-auto ${!showSidebar && "hidden lg:block"}`}
          >
            <ChannelSidebar groupId={groupId} />
          </div>
        )}
        <div
          className={`flex-grow p-4 bg-dark-3 rounded-xl items-center justify-center ${
            showSidebar && "hidden lg:flex"
          }`}
        >
          <div className="text-light-3 text-center">
            <p className="text-xl mb-2">Welcome to EduGather</p>
            <p className="text-lg">Select a channel to start chatting</p>
            <div className="mt-6 text-primary-500">
              <div style={arrowStyle} className="arrow-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </div>
              <p className="text-sm">Choose from the sidebar</p>
            </div>
            <style>
              {`
                @keyframes bounceLeft {
                  0%, 100% {
                    transform: translateX(0);
                  }
                  50% {
                    transform: translateX(-10px);
                  }
                }
              `}
            </style>
          </div>
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 lg:hidden bg-primary-500 text-white p-3 rounded-full shadow-lg"
        >
          {showSidebar ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      </div>
    );
  }

  // With selected channel - show chat layout
  return (
    <div className="flex h-[100dvh] max-h-[100dvh] overflow-y-auto overflow-x-hidden custom-scrollbar bg-dark-2 text-white">
      {groupId && (
        <div
          className={`w-full lg:w-auto ${!showSidebar && "hidden lg:block"}`}
        >
          <ChannelSidebar groupId={groupId} />
        </div>
      )}
      <div
        className={`flex flex-col flex-grow p-4 bg-dark-3 rounded-xl ${
          showSidebar && "hidden md:flex"
        }`}
      >
        <ChatHeader
          channelName={selectedChannel?.channelName || "Channel"}
          membersCount={membersCount}
        />
        <div className="flex flex-col flex-grow justify-between overflow-hidden">
          <ChatWindow userId={userId} />
        </div>
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 lg:hidden bg-primary-500 text-white p-3 rounded-full shadow-lg z-10"
      >
        {showSidebar ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default ChatPage;
