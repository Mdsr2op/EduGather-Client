import { useParams } from "react-router-dom";
import { useGetGroupDetailsQuery } from "../slices/groupApiSlice";
import { MdEdit, MdInfo } from 'react-icons/md';
import GroupMemberCard from './GroupMemberCard';
import { useAppSelector } from "../../../../redux/hook";

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

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-pulse text-light-3">Loading group information...</div>
    </div>
  );
  
  if (isError || !groupDetails) return (
    <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center gap-2">
      <MdInfo className="text-xl" />
      <span>Unable to load group details. Please try again later.</span>
    </div>
  );

  return (
    <div className="p-6 md:p-8 bg-dark-3 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
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
            >
              <MdEdit className="text-lg" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-light-1">{groupDetails.name}</h2>
            {isAdmin && (
              <button 
                className="bg-dark-2 hover:bg-dark-1 p-2 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-primary"
                aria-label="Edit group name"
              >
                <MdEdit className="text-light-1 text-lg" />
              </button>
            )}
          </div>
          <p className="text-sm text-light-3 mb-1">
            Created on <span className="font-medium">{formatDate(groupDetails.createdAt)}</span> by <span className="font-medium">{groupDetails.createdBy.username}</span>
          </p>
          <p className="text-sm text-light-3">{groupDetails.members?.length} members</p>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-8 bg-dark-2 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-light-1">Description</h3>
          {isAdmin && (
            <button 
              className="bg-dark-3 hover:bg-dark-1 p-2 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-primary"
              aria-label="Edit description"
            >
              <MdEdit className="text-light-1 text-lg" />
            </button>
          )}
        </div>
        <p className="text-light-3 leading-relaxed">
          {groupDetails.description || "No description provided."}
        </p>
      </div>

      {/* Categories/Tags Section */}
      {groupDetails.category && groupDetails.category.length > 0 && (
        <div className="mb-8 bg-dark-2 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-light-1">Categories</h3>
            {isAdmin && (
              <button 
                className="bg-dark-3 hover:bg-dark-1 p-2 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-primary"
                aria-label="Edit categories"
              >
                <MdEdit className="text-light-1 text-lg" />
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
      <div className="bg-dark-2 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-light-1 mb-4">Members</h3>
        
        {/* Scrollable container for members */}
        <div className="bg-dark-4/30 rounded-lg shadow-inner h-60 overflow-y-auto custom-scrollbar p-3">
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
            <div className="flex justify-center items-center h-full text-light-3">
              No members found
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-light-3">
            Total Members: <span className="font-medium">{groupDetails.members?.length}</span>
          </p>
          {isAdmin && (
            <button className="text-sm bg-primary hover:bg-primary-600 text-dark-1 px-3 py-1.5 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-2 focus:ring-primary">
              Invite Members
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
