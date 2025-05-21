import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/features/auth/types";
import { MdEmail, MdPerson, MdSettings, MdInfo, MdNotifications, MdBrightness4, MdLogout, MdEdit, MdVpnKey } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";
import { useLogoutMutation } from '../slices/authApiSlice';
import EditUserProfile from './EditUserProfile';
import { useTheme } from '@/context/ThemeContext';

type ViewUserProfileProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
};

type TabType = 'profile' | 'settings';

const ViewUserProfile: React.FC<ViewUserProfileProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isAnimating, setIsAnimating] = useState(false);
  const [logout] = useLogoutMutation();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  if (!user) return null;

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsAnimating(false);
      }, 150); // Match with animation duration
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      onClose(); // Close the profile dialog after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md w-full p-0 bg-gradient-to-b from-dark-2 to-dark-3 dark:from-dark-2 dark:to-dark-3 light:from-light-bg-2 light:to-light-bg-3 text-light-1 dark:text-light-1 light:text-light-text-1 rounded-xl shadow-xl border border-dark-4 dark:border-dark-4 light:border-light-bg-4 overflow-hidden max-h-[80vh]">
          <DialogHeader className="p-5 pb-1">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
              User Profile
            </DialogTitle>
          </DialogHeader>
          
          <div className="overflow-y-auto custom-scrollbar">
            {/* User Avatar & Name */}
            <div className="flex flex-col items-center py-4 px-5 gap-3">
              {user.avatar ? (
                <div className="relative">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-primary-500 to-purple-500">
                    <img
                      src={user.avatar}
                      alt={`${user.username}'s avatar`}
                      className="w-full h-full rounded-full object-cover border-2 border-dark-3 dark:border-dark-3 light:border-light-bg-3"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-3 dark:border-dark-3 light:border-light-bg-3"></div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-primary-500 to-purple-500">
                    <div className="w-full h-full rounded-full bg-dark-2 dark:bg-dark-2 light:bg-light-bg-2 flex items-center justify-center text-light-1 dark:text-light-1 light:text-light-text-1 text-3xl font-bold">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-3 dark:border-dark-3 light:border-light-bg-3"></div>
                </div>
              )}
              
              <div className="text-center">
                <h2 className="text-xl font-bold text-light-1 dark:text-light-1 light:text-light-text-1 mb-1">{user.fullName || user.username}</h2>
                <span className="px-3 py-0.5 bg-dark-4/50 dark:bg-dark-4/50 light:bg-light-bg-4/50 rounded-full text-xs text-light-3 dark:text-light-3 light:text-light-text-3">@{user.username}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-dark-4 dark:border-dark-4 light:border-light-bg-4 mx-4 mb-3">
              <button
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'profile' 
                    ? "border-primary-500 text-primary-500" 
                    : "border-transparent text-light-3 dark:text-light-3 light:text-light-text-3 hover:text-light-2 dark:hover:text-light-2 light:hover:text-light-text-2"
                )}
                onClick={() => handleTabChange('profile')}
              >
                <div className="flex items-center justify-center gap-2">
                  <MdPerson className="text-lg" />
                  <span>Profile</span>
                </div>
              </button>
              <button
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'settings' 
                    ? "border-primary-500 text-primary-500" 
                    : "border-transparent text-light-3 dark:text-light-3 light:text-light-text-3 hover:text-light-2 dark:hover:text-light-2 light:hover:text-light-text-2"
                )}
                onClick={() => handleTabChange('settings')}
              >
                <div className="flex items-center justify-center gap-2">
                  <MdSettings className="text-lg" />
                  <span>Settings</span>
                </div>
              </button>
            </div>
            
            {/* Tab Content with Animation */}
            <div className="px-5 pb-5 relative min-h-[150px]">
              <div className={cn(
                "absolute w-full left-0 right-0 px-5 transition-all duration-150 ease-in-out",
                isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0',
                activeTab !== 'profile' && !isAnimating && 'hidden'
              )}>
                {activeTab === 'profile' && !isAnimating && (
                  <div className="space-y-3">
                    <div className="bg-dark-4/50 dark:bg-dark-4/50 light:bg-light-bg-4/50 p-3 rounded-xl flex items-center gap-3 backdrop-blur-sm hover:bg-dark-4 dark:hover:bg-dark-4 light:hover:bg-light-bg-4 transition-colors">
                      <div className="bg-primary-500/20 p-2 rounded-full">
                        <MdEmail className="text-primary-500 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3 mb-0.5">Email</p>
                        <p className="text-light-1 dark:text-light-1 light:text-light-text-1 text-sm font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="bg-dark-4/50 dark:bg-dark-4/50 light:bg-light-bg-4/50 p-3 rounded-xl flex items-center gap-3 backdrop-blur-sm hover:bg-dark-4 dark:hover:bg-dark-4 light:hover:bg-light-bg-4 transition-colors">
                      <div className="bg-primary-500/20 p-2 rounded-full">
                        <MdInfo className="text-primary-500 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3 mb-0.5">Account Status</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <p className="text-light-1 dark:text-light-1 light:text-light-text-1 text-sm font-medium">Active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={cn(
                "absolute w-full left-0 right-0 px-5 transition-all duration-150 ease-in-out",
                isAnimating ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0',
                activeTab !== 'settings' && !isAnimating && 'hidden'
              )}>
                {activeTab === 'settings' && !isAnimating && (
                  <div className="space-y-4 w-full">
                    {/* Account Settings Section */}
                    <div className="bg-dark-4/30 dark:bg-dark-4/30 light:bg-light-bg-4/30 rounded-lg overflow-hidden">
                      <div className="bg-dark-4/60 dark:bg-dark-4/60 light:bg-light-bg-4/60 px-3 py-2">
                        <h3 className="text-sm font-medium text-light-2 dark:text-light-2 light:text-light-text-2">Account Settings</h3>
                      </div>
                      <div className="p-2">
                        <button 
                          className="w-full py-2 px-3 rounded-md flex items-center gap-3 hover:bg-dark-4 dark:hover:bg-dark-4 light:hover:bg-light-bg-4 transition-colors text-left"
                          onClick={() => setShowEditProfile(true)}
                        >
                          <div className="bg-primary-500/10 p-1.5 rounded-full flex-shrink-0">
                            <MdEdit className="text-primary-500 text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-light-1 dark:text-light-1 light:text-light-text-1">Edit Profile</p>
                            <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3">Update your personal information</p>
                          </div>
                        </button>
                        <button className="w-full py-2 px-3 rounded-md flex items-center gap-3 hover:bg-dark-4 dark:hover:bg-dark-4 light:hover:bg-light-bg-4 transition-colors text-left mt-1">
                          <div className="bg-primary-500/10 p-1.5 rounded-full flex-shrink-0">
                            <MdVpnKey className="text-primary-500 text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-light-1 dark:text-light-1 light:text-light-text-1">Change Password</p>
                            <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3">Update your security credentials</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-dark-4/30 dark:bg-dark-4/30 light:bg-light-bg-4/30 rounded-lg overflow-hidden">
                      <div className="bg-dark-4/60 dark:bg-dark-4/60 light:bg-light-bg-4/60 px-3 py-2">
                        <h3 className="text-sm font-medium text-light-2 dark:text-light-2 light:text-light-text-2">Notification Settings</h3>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="bg-primary-500/10 p-1.5 rounded-full flex-shrink-0">
                              <MdNotifications className="text-primary-500 text-lg" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-light-1 dark:text-light-1 light:text-light-text-1 truncate">Email Notifications</p>
                              <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3 truncate">Receive activity notifications</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Switch defaultChecked id="email-notifications" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appearance Settings */}
                    <div className="bg-dark-4/30 dark:bg-dark-4/30 light:bg-light-bg-4/30 rounded-lg overflow-hidden">
                      <div className="bg-dark-4/60 dark:bg-dark-4/60 light:bg-light-bg-4/60 px-3 py-2">
                        <h3 className="text-sm font-medium text-light-2 dark:text-light-2 light:text-light-text-2">Appearance</h3>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="bg-primary-500/10 p-1.5 rounded-full flex-shrink-0">
                              <MdBrightness4 className="text-primary-500 text-lg" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-light-1 dark:text-light-1 light:text-light-text-1 truncate">Dark Mode</p>
                              <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3 truncate">Toggle between light and dark</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Switch 
                              checked={theme === 'dark'} 
                              onCheckedChange={toggleTheme}
                              id="dark-mode" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="w-full">
                      <button 
                        className="py-2.5 px-4 bg-transparent hover:bg-red-500/10 text-red-400 rounded-lg transition-colors font-medium border border-red-500/30 text-sm flex items-center justify-center gap-2 mt-2 w-full"
                        onClick={handleLogout}
                      >
                        <MdLogout className="text-lg" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showEditProfile && (
        <EditUserProfile 
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          user={user}
        />
      )}
    </>
  );
};

export default ViewUserProfile;