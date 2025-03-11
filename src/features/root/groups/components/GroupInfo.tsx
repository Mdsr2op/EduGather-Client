import { useParams } from "react-router-dom";
import { useGetGroupDetailsQuery } from "../slices/groupApiSlice";
import { MdEdit } from 'react-icons/md';

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
  const isAdmin = true;

  if (isLoading) return <div>Loading...</div>;
  if (isError || !groupDetails) return <div>Error fetching group details</div>;

  return (
    <div className="p-8 bg-dark-3 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <img
          src={groupDetails.avatar}
          alt={`${groupDetails.name} Avatar`}
          className="w-20 h-20 rounded-full object-cover mr-6 border-2 border-primary"
        />
        <div className="flex items-center w-full justify-between">
          <div>
            <h2 className="text-2xl font-bold text-light-1 mb-1">{groupDetails.name}</h2>
            <p className="text-xs text-light-3">{formatDate(groupDetails.createdAt)}</p>
          </div>
          {isAdmin && <MdEdit className="text-light-1 ml-4 cursor-pointer text-xl" />}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-light-1 mb-2">Description</h3>
          {isAdmin && <MdEdit className="text-light-1 cursor-pointer text-xl" />}
        </div>
        <p className="text-sm text-light-3">{groupDetails.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-light-1 mb-2">Created By</h3>
        </div>
        <p className="text-sm text-light-3">{groupDetails.createdBy.username}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-light-1 mb-3">Members</h3>
        {/* Scrollable container for members */}
        <div className="bg-dark-2 rounded-lg p-4 shadow-inner h-48 overflow-y-auto custom-scrollbar pr-4">
          {groupDetails.members?.map((member) => (
            <div 
              key={member._id}
              className="flex items-center mb-3 p-2 rounded-lg transition-colors hover:bg-dark-1"
            >
              <img
                src={member.avatar || 'https://via.placeholder.com/80'}
                alt={`${member.username} Avatar`}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <p className="text-sm font-semibold text-light-1">{member.username}</p>
                <p className="text-xs text-light-3">{member.email}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-light-3 mt-2">
          Total Members: {groupDetails.members?.length}
        </p>
      </div>
    </div>
  );
};

export default GroupInfo;
