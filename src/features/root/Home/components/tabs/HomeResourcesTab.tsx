import { useState } from 'react';
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
      className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl p-5 shadow-lg border border-dark-5 dark:border-dark-5 light:border-light-bg-5"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-light-1 dark:text-light-1 light:text-light-text-1 flex items-center gap-2">
            <FiBook className="text-primary-500" />
            Learning Resources
          </h2>
          <p className="text-light-3 dark:text-light-3 light:text-light-text-3 text-sm sm:text-base mt-1">
            Access educational materials, documents, and shared content
          </p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-3 border-primary-500 border-t-transparent rounded-full shadow-md"></div>
        </div>
      ) : userAttachmentsData && userAttachmentsData.data.attachments.length > 0 ? (
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-light-1 dark:text-light-1 light:text-light-text-1">Your Attachments</h3>
              <div className="text-sm text-light-3 dark:text-light-3 light:text-light-text-3">
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
                    className="bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-xl p-4 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 hover:border-primary-500/30 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 dark:from-primary-500/20 light:from-primary-500/30 to-primary-400/10 dark:to-primary-400/10 light:to-primary-400/20 rounded-lg flex items-center justify-center text-primary-500 dark:text-primary-500 light:text-primary-600 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary-500/5 dark:bg-primary-500/5 light:bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          {getFileIcon(attachment.fileType)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-light-1 dark:text-light-1 light:text-light-text-1 truncate group-hover:text-primary-400 transition-colors">
                          {attachment.fileName}
                        </h4>
                        
                        <div className="flex items-center text-xs text-light-3 dark:text-light-3 light:text-light-text-3 mt-1">
                          <span className="bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-500/20 px-1.5 py-0.5 rounded text-primary-500 dark:text-primary-500 light:text-primary-600 font-medium">{formatFileSize(attachment.size)}</span>
                          <div className="w-1 h-1 bg-light-4 dark:bg-light-4 light:bg-light-text-4 rounded-full mx-2"></div>
                          <span>{new Date(attachment.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {populatedAttachment.channelId && typeof populatedAttachment.channelId === 'object' && 'channelName' in populatedAttachment.channelId && (
                          <div className="mt-2 text-xs">
                            <span className="px-2 py-0.5 bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-full text-primary-400 dark:text-primary-400 light:text-primary-500 border border-primary-500/10 dark:border-primary-500/10 light:border-primary-500/20">
                              # {populatedAttachment.channelId.channelName}
                            </span>
                          </div>
                        )}
                        
                        {populatedAttachment.messageId && typeof populatedAttachment.messageId === 'object' && 'content' in populatedAttachment.messageId && (
                          <div className="mt-2 text-xs text-light-4 dark:text-light-4 light:text-light-text-4 line-clamp-1 bg-dark-3/50 dark:bg-dark-3/50 light:bg-light-bg-3/50 p-1.5 rounded-md border-l-2 border-primary-500/30">
                            {populatedAttachment.messageId.content && (
                              <span className="italic">"{populatedAttachment.messageId.content}"</span>
                            )}
                            {populatedAttachment.messageId.senderId && typeof populatedAttachment.messageId.senderId === 'object' && 'username' in populatedAttachment.messageId.senderId && (
                              <span className="ml-1 font-medium text-light-3 dark:text-light-3 light:text-light-text-3">- {populatedAttachment.messageId.senderId.username}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 hover:bg-primary-500 rounded-lg transition-all text-light-3 dark:text-light-3 light:text-light-text-3 hover:text-light-1 dark:hover:text-light-1 light:hover:text-white transform hover:scale-105 shadow-sm hover:shadow-md"
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
                      page > 1 
                        ? 'bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 hover:bg-dark-5 dark:hover:bg-dark-5 light:hover:bg-light-bg-5 cursor-pointer' 
                        : 'bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 cursor-not-allowed opacity-50'
                    } transition-colors`}
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                  >
                    <FiChevronRight className="rotate-180" size={16} />
                  </button>
                  <span className="text-light-3 dark:text-light-3 light:text-light-text-3 text-sm">
                    Page {userAttachmentsData.data.pagination.page} of {userAttachmentsData.data.pagination.totalPages}
                  </span>
                  <button 
                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      page < userAttachmentsData.data.pagination.totalPages 
                        ? 'bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 hover:bg-dark-5 dark:hover:bg-dark-5 light:hover:bg-light-bg-5 cursor-pointer' 
                        : 'bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 cursor-not-allowed opacity-50'
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
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 dark:from-primary-500/20 light:from-primary-500/30 to-primary-400/10 dark:to-primary-400/10 light:to-primary-400/20 rounded-full flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary-500/5 dark:bg-primary-500/5 light:bg-primary-500/10 animate-pulse"></div>
            <FiBook className="text-primary-500 dark:text-primary-500 light:text-primary-600 relative z-10" size={32} />
          </div>
          <h3 className="text-xl font-bold text-light-1 dark:text-light-1 light:text-light-text-1 mb-3 bg-gradient-to-r from-primary-400 dark:from-primary-400 light:from-primary-500 to-secondary-400 dark:to-secondary-400 light:to-secondary-500 bg-clip-text text-transparent">No Attachments Found</h3>
          <p className="text-light-3 dark:text-light-3 light:text-light-text-3 max-w-lg mb-8">
            You don't have any attachments yet. Attachments shared in your group channels will appear here.
          </p>
          
          {/* Feature preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
            <div className="bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-xl p-4 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 hover:border-primary-500/30 transition-all group shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 dark:from-primary-500/20 light:from-primary-500/30 to-primary-400/10 dark:to-primary-400/10 light:to-primary-400/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FiBook className="text-primary-500 dark:text-primary-500 light:text-primary-600" size={18} />
              </div>
              <h4 className="font-medium text-light-1 dark:text-light-1 light:text-light-text-1 mb-1 text-center group-hover:text-primary-400 transition-colors">Study Materials</h4>
              <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3 text-center">Access shared notes, documents, and resources</p>
            </div>
            
            <div className="bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-xl p-4 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 hover:border-secondary-500/30 transition-all group shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500/20 dark:from-secondary-500/20 light:from-secondary-500/30 to-secondary-400/10 dark:to-secondary-400/10 light:to-secondary-400/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FiAward className="text-secondary-500 dark:text-secondary-500 light:text-secondary-600" size={18} />
              </div>
              <h4 className="font-medium text-light-1 dark:text-light-1 light:text-light-text-1 mb-1 text-center group-hover:text-secondary-400 transition-colors">Quizzes & Tests</h4>
              <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3 text-center">Practice with interactive assessments</p>
            </div>
            
            <div className="bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-xl p-4 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 hover:border-green-500/30 transition-all group shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 dark:from-green-500/20 light:from-green-500/30 to-green-400/10 dark:to-green-400/10 light:to-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FiGlobe className="text-green-500 dark:text-green-500 light:text-green-600" size={18} />
              </div>
              <h4 className="font-medium text-light-1 dark:text-light-1 light:text-light-text-1 mb-1 text-center group-hover:text-green-400 transition-colors">External Resources</h4>
              <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3 text-center">Links to helpful websites and tools</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HomeResourcesTab; 