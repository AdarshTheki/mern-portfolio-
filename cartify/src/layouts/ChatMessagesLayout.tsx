import ChatApplication from '../modules/chat-messages/ChatApplication';
import TopHeaderChat from '../modules/chat-messages/TopHeaderChat';

const ChatMessagesLayout = () => {
  return (
    <div className='h-screen'>
      <TopHeaderChat />
      <div className='h-[90vh]'>
        <ChatApplication />
      </div>
    </div>
  );
};

export default ChatMessagesLayout;
