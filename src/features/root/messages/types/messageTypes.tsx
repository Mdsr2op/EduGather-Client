export interface MessageType {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    timestamp: number;
    pinned?: boolean;
    channelId?: string;
    attachment?: {
      id: string;
      url: string;
      fileType: string;
      fileName: string;
      size: number;
      type?: 'file' | 'image' | 'video' | 'meeting';
      meetingData?: {
        meetingId: string;
        title: string;
        startTime: string;
        endTime?: string;
        status: 'scheduled' | 'ongoing' | 'ended';
        participantsCount?: number;
      };
    };
    replyTo?: {
      id: string;
      text: string;
      senderId: string;
      senderName: string;
    };
    createdAt?: string;
    updatedAt?: string;
    pinnedBy?: string;
    pinnedAt?: string;
    deletedAt?: string;
    mentions?: string[];
    forwardedFrom?: {
      messageId: string;
      channelId: string;
      senderId: string;
    };
  }
  
  export interface MessageContextMenuProps {
    message: MessageType;
    position: { x: number; y: number };
    onClose: () => void;
    onAction: (action: string) => void;
    isUserMessage: boolean;
  }
  
  export interface MessageContentProps {
    text: string;
  }
  
  export interface MessageAttachmentProps {
    attachment: {
      id: string;
      url: string;
      fileType: string;
      fileName: string;
      size: number;
      type?: 'file' | 'image' | 'video' | 'meeting';
      meetingData?: {
        meetingId: string;
        title: string;
        startTime: string;
        endTime?: string;
        status: 'scheduled' | 'ongoing' | 'ended';
        participantsCount?: number;
      };
    };
    isUserMessage: boolean;
  }
  
  export interface MessageReplyInfoProps {
    replyTo: {
      id: string;
      text: string;
      senderId: string;
      senderName: string;
    };
  }
  
  export interface MessageEditFormProps {
    content: string;
    setContent: (content: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  }