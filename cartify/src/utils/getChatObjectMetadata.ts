import type { ChatType } from '../types/ChatMessages';
import type { UserType } from '../types/User';

type GetMetadataReturnProp = {
  avatar: string;
  title: string; // Group name serves as the title.
  description: string; // Description indicates the number of members.
  lastMessage: string;
};

export const getChatObjectMetadata = (
  chat: ChatType | null, // The chat item for which metadata is being generated.
  loggedInUser: UserType | null // The currently logged-in user details.
): GetMetadataReturnProp => {
  // Determine the content of the last message, if any.
  // If the last message contains only attachments, indicate their count.
  const lastMessage = chat?.lastMessage?.content
    ? chat?.lastMessage?.content
    : chat?.lastMessage
    ? `${chat?.lastMessage?.attachments?.length} attachment${
        chat?.lastMessage.attachments.length > 1 ? 's' : ''
      }`
    : 'No messages yet'; // Placeholder text if there are no messages.

  if (chat?.isGroupChat) {
    // Case: Group chat
    // Return metadata specific to group chats.
    return {
      // Default avatar for group chats.
      avatar: '',
      title: chat.name, // Group name serves as the title.
      description: `${chat?.participants.length} members in the chat`, // Description indicates the number of members.
      lastMessage: chat?.lastMessage
        ? chat?.lastMessage?.sender?.fullName + ': ' + lastMessage
        : lastMessage,
    };
  } else {
    // Case: Individual chat
    // Identify the participant other than the logged-in user.
    const participant = chat?.participants.find((p) => p._id !== loggedInUser?._id);
    // Return metadata specific to individual chats.
    return {
      avatar: participant?.avatar || 'none', // Participant's avatar URL.
      title: participant?.fullName || 'guest', // Participant's username serves as the title.
      description: participant?.email || 'guest@gmail.com', // Email address of the participant.
      lastMessage,
    };
  }
};
