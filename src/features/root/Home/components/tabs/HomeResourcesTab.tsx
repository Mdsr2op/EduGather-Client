import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBook, FiDownload, FiFile, FiImage, 
  FiFileText, FiVideo, FiMusic, FiChevronRight,
  FiAward, FiGlobe
} from 'react-icons/fi';
import { useGetUserAttachmentsQuery, Attachment } from '@/features/root/attachments/slices/attachmentsApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';

// Extended interfaces for populated fields
interface User {
  _id: string;
  username: string;
  avatar?: string;
}

interface Channel {
  _id: string;
  channelName: string;
}

interface MessageWithSender {
  _id: string;
  content: string;
  senderId: User;
}

interface PopulatedAttachment extends Omit<Attachment, 'channelId' | 'messageId'> {
  channelId: Channel;
  messageId: MessageWithSender;
}

const HomeResourcesTab = () => {
  const user = useSelector(selectCurrentUser);
  const [page, setPage] = useState(1);
  
  // Get user attachments
  const { data: userAttachmentsData, isLoading } = useGetUserAttachmentsQuery(
    { page, limit: 20 },
    { skip: !user?._id }
  );
  
  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (userAttachmentsData && page < userAttachmentsData.data.pagination.totalPages) {
      setPage(page + 1);
    }
  };
  
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FiImage size={20} />;
    if (fileType.startsWith('video/')) return <FiVideo size={20} />;
    if (fileType.startsWith('audio/')) return <FiMusic size={20} />;
    if (fileType.includes('pdf')) return <FiFileText size={20} />;
    return <FiFile size={20} />;
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-dark-3 rounded-xl p-5 shadow-lg border border-dark-5"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-light-1 flex items-center gap-2">
            <FiBook className="text-primary-500" />
            Learning Resources
          </h2>
          <p className="text-light-3 text-sm sm:text-base mt-1">
            Access educational materials, documents, and shared content
          </p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-3 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      ) : userAttachmentsData && userAttachmentsData.data.attachments.length > 0 ? (
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-light-1">Your Attachments</h3>
              <div className="text-sm text-light-3">
                {userAttachmentsData.data.pagination.total} items
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAttachmentsData.data.attachments.map((attachment, index) => {
                // Cast the attachment to the populated type
                const populatedAttachment = attachment as unknown as PopulatedAttachment;
                
                return (
                  <motion.div
                    key={attachment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-dark-4 rounded-xl p-4 border border-dark-5 hover:border-primary-500/30 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center text-primary-500">
                        {getFileIcon(attachment.fileType)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-light-1 truncate group-hover:text-primary-400 transition-colors">
                          {attachment.fileName}
                        </h4>
                        
                        <div className="flex items-center text-xs text-light-3 mt-1">
                          <span>{formatFileSize(attachment.size)}</span>
                          <div className="w-1 h-1 bg-light-4 rounded-full mx-2"></div>
                          <span>{new Date(attachment.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {populatedAttachment.channelId && typeof populatedAttachment.channelId === 'object' && 'channelName' in populatedAttachment.channelId && (
                          <div className="mt-2 text-xs">
                            <span className="px-2 py-0.5 bg-dark-3 rounded-full text-primary-400">
                              # {populatedAttachment.channelId.channelName}
                            </span>
                          </div>
                        )}
                        
                        {populatedAttachment.messageId && typeof populatedAttachment.messageId === 'object' && 'content' in populatedAttachment.messageId && (
                          <div className="mt-2 text-xs text-light-4 line-clamp-1">
                            {populatedAttachment.messageId.content && (
                              <span className="italic">"{populatedAttachment.messageId.content}"</span>
                            )}
                            {populatedAttachment.messageId.senderId && typeof populatedAttachment.messageId.senderId === 'object' && 'username' in populatedAttachment.messageId.senderId && (
                              <span className="ml-1">- {populatedAttachment.messageId.senderId.username}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-dark-3 hover:bg-primary-500 rounded-lg transition-colors text-light-3 hover:text-light-1"
                        title="Download"
                      >
                        <FiDownload size={16} />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {userAttachmentsData && userAttachmentsData.data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2">
                  <button 
                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      page > 1 ? 'bg-dark-4 hover:bg-dark-5 cursor-pointer' : 'bg-dark-3 cursor-not-allowed opacity-50'
                    } transition-colors`}
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                  >
                    <FiChevronRight className="rotate-180" size={16} />
                  </button>
                  <span className="text-light-3 text-sm">
                    Page {userAttachmentsData.data.pagination.page} of {userAttachmentsData.data.pagination.totalPages}
                  </span>
                  <button 
                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      page < userAttachmentsData.data.pagination.totalPages ? 'bg-dark-4 hover:bg-dark-5 cursor-pointer' : 'bg-dark-3 cursor-not-allowed opacity-50'
                    } transition-colors`}
                    onClick={handleNextPage}
                    disabled={page >= userAttachmentsData.data.pagination.totalPages}
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
            <FiBook className="text-primary-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-light-1 mb-3">No Attachments Found</h3>
          <p className="text-light-3 max-w-lg mb-8">
            You don't have any attachments yet. Attachments shared in your group channels will appear here.
          </p>
          
          {/* Feature preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
            <div className="bg-dark-4 rounded-xl p-4 border border-dark-5">
              <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiBook className="text-primary-500" size={18} />
              </div>
              <h4 className="font-medium text-light-1 mb-1">Study Materials</h4>
              <p className="text-xs text-light-3">Access shared notes, documents, and resources</p>
            </div>
            
            <div className="bg-dark-4 rounded-xl p-4 border border-dark-5">
              <div className="w-12 h-12 bg-secondary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiAward className="text-secondary-500" size={18} />
              </div>
              <h4 className="font-medium text-light-1 mb-1">Quizzes & Tests</h4>
              <p className="text-xs text-light-3">Practice with interactive assessments</p>
            </div>
            
            <div className="bg-dark-4 rounded-xl p-4 border border-dark-5">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiGlobe className="text-green-500" size={18} />
              </div>
              <h4 className="font-medium text-light-1 mb-1">External Resources</h4>
              <p className="text-xs text-light-3">Links to helpful websites and tools</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HomeResourcesTab; 