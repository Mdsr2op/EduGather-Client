import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/features/auth/types";
import { useUpdateProfileMutation } from '../slices/authApiSlice';
import { MdCloudUpload } from 'react-icons/md';
import { toast } from 'react-hot-toast';

type EditUserProfileProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
};

const EditUserProfile: React.FC<EditUserProfileProps> = ({ isOpen, onClose, user }) => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  
  if (!user) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('username', formData.username);
      submitFormData.append('fullName', formData.fullName);
      submitFormData.append('email', formData.email);
      
      // Add avatar if changed
      if (avatarFile) {
        submitFormData.append('avatar', avatarFile);
      }
      
      await updateProfile(submitFormData).unwrap();
      onClose();
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Profile update failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full p-0 bg-gradient-to-b from-dark-2 to-dark-3 text-light-1 rounded-xl shadow-xl border border-dark-4 overflow-hidden max-h-[90vh]">
        <DialogHeader className="p-5 pb-1">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar px-5 pb-5">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center py-4 gap-3 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-primary-500 to-purple-500">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full rounded-full object-cover border-2 border-dark-3"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-dark-2 flex items-center justify-center text-light-1 text-3xl font-bold">
                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : formData.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary-500 p-1.5 rounded-full cursor-pointer border-2 border-dark-3 hover:bg-primary-600 transition-colors">
                <MdCloudUpload className="text-light-1 text-lg" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <span className="text-xs text-light-3">Click the upload icon to change your avatar</span>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-light-2">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="bg-dark-4/70 border-dark-4 focus:border-primary-500 focus:ring-primary-500/20 text-light-1"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-light-2">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="bg-dark-4/70 border-dark-4 focus:border-primary-500 focus:ring-primary-500/20 text-light-1"
                placeholder="Enter your username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-light-2">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-dark-4/70 border-dark-4 focus:border-primary-500 focus:ring-primary-500/20 text-light-1"
                placeholder="Enter your email"
              />
            </div>
          </div>
        
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              onClick={onClose}
              variant="outline" 
              className="bg-transparent border-dark-4 text-light-2 hover:bg-dark-4 hover:text-light-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {isLoading ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserProfile; 