import { useParams } from "react-router-dom";
import { useGetGroupDetailsQuery, useUpdateGroupMutation } from "../slices/groupApiSlice";
import { MdEdit, MdInfo } from 'react-icons/md';
import GroupMemberCard from './GroupMemberCard';
import { useAppSelector } from "../../../../redux/hook";
import { useState, useMemo, useRef } from 'react';
import EditGroupDialog from '../dialogs/EditGroupDialog';
import { toast } from 'react-hot-toast';
import { UserJoinedGroups } from "../slices/groupSlice";
import { useTheme } from '@/context/ThemeContext';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const GroupInfo = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: groupDetails, isLoading, isError } = useGetGroupDetailsQuery(groupId!);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState<'name' | 'description' | 'avatar' | 'categories' | null>(null);
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
  
  // Refs for inline editing
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Inline edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  
  // Get current user ID from auth state
  const currentUserId = useAppSelector(state => state.auth.user?._id);
  
  // Check if current user is an admin in this group
  const isAdmin = currentUserId && groupDetails?.members?.some(
    member => member._id === currentUserId && member.role === "admin"
  ) || false;

  // Check if current user is a moderator in this group
  const isModerator = currentUserId && groupDetails?.members?.some(
    member => member._id === currentUserId && member.role === "moderator"
  ) || false;

  // Determine the current user's role
  const currentUserRole = isAdmin ? "admin" : isModerator ? "moderator" : "member";

  // Transform groupDetails to match UserJoinedGroups type for EditGroupDialog
  const formattedGroup = useMemo(() => {
    if (!groupDetails) return null;
    
    const transformedGroup: UserJoinedGroups = {
      _id: groupDetails._id,
      name: groupDetails.name,
      description: groupDetails.description,
      avatar: groupDetails.avatar || undefined,
      members: groupDetails.members,
      createdAt: groupDetails.createdAt,
      isJoinableExternally: groupDetails.isJoinableExternally,
      category: groupDetails.category,
      // Transform the User type to CreatedBy type
      createdBy: {
        _id: groupDetails.createdBy._id,
        username: groupDetails.createdBy.username,
        fullName: groupDetails.createdBy.fullName || '',
        avatar: groupDetails.createdBy.avatar || '',
      }
    };
    
    return transformedGroup;
  }, [groupDetails]);

  // Function to handle opening the edit dialog for more complex edits
  const handleEditClick = (field: 'name' | 'description' | 'avatar' | 'categories') => {
    // For avatar and categories, always use the dialog
    if (field === 'avatar' || field === 'categories') {
      setEditField(field);
      setIsEditDialogOpen(true);
      
      const fieldNames = {
        'avatar': 'group avatar',
        'categories': 'group categories'
      };
      
      toast.success(`Editing ${fieldNames[field]}...`, {
        position: "top-right"
      });
      return;
    }
    
    // For name and description, allow inline editing
    if (field === 'name') {
      setIsEditingName(true);
      setEditedName(groupDetails?.name || '');
      setTimeout(() => nameInputRef.current?.focus(), 0);
    } else if (field === 'description') {
      setIsEditingDescription(true);
      setEditedDescription(groupDetails?.description || '');
      setTimeout(() => descriptionInputRef.current?.focus(), 0);
    }
  };
  
  // Function to handle inline updates for name and description
  const handleInlineUpdate = async (field: 'name' | 'description') => {
    if (!groupId) return;
    
    try {
      const formData = new FormData();
      
      if (field === 'name') {
        if (!editedName.trim() || editedName === groupDetails?.name) {
          setIsEditingName(false);
          return;
        }
        formData.append('name', editedName);
      } else if (field === 'description') {
        if (!editedDescription.trim() || editedDescription === groupDetails?.description) {
          setIsEditingDescription(false);
          return;
        }
        formData.append('description', editedDescription);
      }
      
      // Keep other fields unchanged
      if (field === 'name') {
        formData.append('description', groupDetails?.description || '');
      } else if (field === 'description') {
        formData.append('name', groupDetails?.name || '');
      }
      
      // Add required fields
      formData.append('isJoinableExternally', String(groupDetails?.isJoinableExternally ?? true));
      
      // Make the API call
      await updateGroup({ groupId, formData }).unwrap();
      
      // Show success message
      toast.success(`Group ${field} updated successfully!`, {
        position: "top-right"
      });
      
      // Reset editing states
      if (field === 'name') setIsEditingName(false);
      if (field === 'description') setIsEditingDescription(false);
      
    } catch (error) {
      console.error(`Error updating group ${field}:`, error);
      toast.error(`Failed to update ${field}. Please try again.`, {
        position: "top-right"
      });
    }
  };

  const { theme } = useTheme();

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <div className={`animate-pulse ${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'}`}>
        Loading group information...
      </div>
    </div>
  );
  
  if (isError || !groupDetails) return (
    <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center gap-2">
      <MdInfo className="text-xl" />
      <span>Unable to load group details. Please try again later.</span>
    </div>
  );

  return (
    <div className={`p-6 md:p-8 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl ${
      theme === 'dark' ? 'bg-dark-3' : 'bg-light-bg-4'
    }`}>
      {/* Header with group name and avatar */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative group">
          <img
            src={groupDetails.avatar}
            alt={`${groupDetails.name} Avatar`}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-3 border-primary shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          {isAdmin && (
            <button 
              className="absolute bottom-0 right-0 bg-primary-500 text-dark-1 p-2 rounded-full shadow-lg hover:bg-primary-600 transition-all duration-200 opacity-90 hover:opacity-100"
              aria-label="Edit group avatar"
              onClick={() => handleEditClick('avatar')}
            >
              <MdEdit className="text-lg" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input 
                  ref={nameInputRef}
                  type="text" 
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className={`text-2xl md:text-3xl font-bold border-b-2 border-primary-500 focus:outline-none p-1 rounded ${
                    theme === 'dark' 
                      ? 'bg-dark-1 text-light-1' 
                      : 'bg-light-bg-1 text-light-text-1'
                  }`}
                  onBlur={() => handleInlineUpdate('name')}
                  onKeyDown={(e) => e.key === 'Enter' && handleInlineUpdate('name')}
                  aria-label="Edit group name"
                />
                <button 
                  onClick={() => handleInlineUpdate('name')}
                  className="bg-primary-500 text-light-1 p-1 rounded hover:bg-primary-600"
                  disabled={isUpdating}
                >
                  Save
                </button>
              </div>
            ) : (
              <h2 className={`text-2xl md:text-3xl font-bold ${
                theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
              }`}>{groupDetails.name}</h2>
            )}
            
            {isAdmin && !isEditingName && (
              <button 
                className={`p-2 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-primary ${
                  theme === 'dark' 
                    ? 'bg-dark-2 hover:bg-dark-1' 
                    : 'bg-light-bg-1 hover:bg-light-bg-3'
                }`}
                aria-label="Edit group name"
                onClick={() => handleEditClick('name')}
              >
                <MdEdit className={`text-lg ${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'}`} />
              </button>
            )}
          </div>
          <p className={`text-sm mb-1 ${
            theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
          }`}>
            Created on <span className="font-medium">{formatDate(groupDetails.createdAt)}</span> by <span className="font-medium">{groupDetails.createdBy.username}</span>
          </p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
          }`}>{groupDetails.members?.length} members</p>
        </div>
      </div>

      {/* Description section */}
      <div className={`mb-8 p-4 rounded-xl ${
        theme === 'dark' ? 'bg-dark-2' : 'bg-light-bg-1'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
          }`}>Description</h3>
          {isAdmin && !isEditingDescription && (
            <button 
              className={`p-2 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-primary ${
                theme === 'dark' 
                  ? 'bg-dark-3 hover:bg-dark-1' 
                  : 'bg-light-bg-2 hover:bg-light-bg-3'
              }`}
              aria-label="Edit description"
              onClick={() => handleEditClick('description')}
            >
              <MdEdit className={`text-lg ${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'}`} />
            </button>
          )}
        </div>
        
        {isEditingDescription ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={descriptionInputRef}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className={`leading-relaxed border-2 border-primary-500/30 focus:border-primary-500 focus:outline-none p-2 rounded resize-none min-h-[100px] ${
                theme === 'dark' 
                  ? 'bg-dark-1 text-light-3' 
                  : 'bg-light-bg-2 text-light-text-3'
              }`}
              placeholder="Enter group description"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsEditingDescription(false)}
                className={`px-3 py-1 rounded ${
                  theme === 'dark' 
                    ? 'bg-dark-3 text-light-1 hover:bg-dark-1' 
                    : 'bg-light-bg-2 text-light-text-1 hover:bg-light-bg-3'
                }`}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleInlineUpdate('description')}
                className="bg-primary-500 text-light-1 px-3 py-1 rounded hover:bg-primary-600"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className={`leading-relaxed ${
            theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
          }`}>
            {groupDetails.description || "No description provided."}
          </p>
        )}
      </div>

      {/* Categories/Tags Section */}
      {groupDetails.category && groupDetails.category.length > 0 && (
        <div className={`mb-8 p-4 rounded-xl ${
          theme === 'dark' ? 'bg-dark-2' : 'bg-light-bg-1'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
            }`}>Categories</h3>
            {isAdmin && (
              <button 
                className={`p-2 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-primary ${
                  theme === 'dark' 
                    ? 'bg-dark-3 hover:bg-dark-1' 
                    : 'bg-light-bg-2 hover:bg-light-bg-3'
                }`}
                aria-label="Edit categories"
                onClick={() => handleEditClick('categories')}
              >
                <MdEdit className={`text-lg ${theme === 'dark' ? 'text-light-1' : 'text-light-text-1'}`} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {groupDetails.category.map((tag, index) => (
              <span 
                key={index} 
                className="bg-primary-500/20 text-primary-500 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:bg-primary-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Members section */}
      <div className={`rounded-xl p-4 shadow-lg ${
        theme === 'dark' ? 'bg-dark-2' : 'bg-light-bg-1'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
        }`}>Members</h3>
        
        {/* Scrollable container for members */}
        <div className={`rounded-xl shadow-inner h-60 overflow-y-auto custom-scrollbar p-3 ${
          theme === 'dark' ? 'bg-dark-4/30' : 'bg-light-bg-2/30'
        }`}>
          {groupDetails.members?.length ? (
            groupDetails.members.map((member) => (
              <GroupMemberCard 
                key={member._id} 
                member={member} 
                isAdmin={isAdmin} 
                groupId={groupId!}
                currentUserRole={currentUserRole}
              />
            ))
          ) : (
            <div className={`flex justify-center items-center h-full ${
              theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
            }`}>
              No members found
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <p className={`text-xs ${
            theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
          }`}>
            Total Members: <span className="font-medium">{groupDetails.members?.length}</span>
          </p>
          {isAdmin && (
            <button className="text-sm bg-primary hover:bg-primary-600 text-dark-1 px-3 py-1.5 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-2 focus:ring-primary">
              Invite Members
            </button>
          )}
        </div>
      </div>

      {/* Edit Group Dialog */}
      {isEditDialogOpen && formattedGroup && (
        <EditGroupDialog 
          isOpen={isEditDialogOpen} 
          setIsOpen={setIsEditDialogOpen} 
          group={formattedGroup}
          focusField={editField || undefined}
        />
      )}
    </div>
  );
};

export default GroupInfo;
