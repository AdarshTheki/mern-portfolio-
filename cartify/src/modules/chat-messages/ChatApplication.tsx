import React, { useCallback, useMemo, useState } from 'react';
import { useChat } from '../../hooks';
import type { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import type { ChatType } from '../../types/ChatMessages';
import { cn, getChatObjectMetadata, socket } from '../../utils';
import { ArrowLeft, ImageUp, Plus, Search, Send, Trash2Icon, X } from 'lucide-react';
import { Avatar, Input, Loading } from '../../components';
import ChatItem from './components/ChatItem';
import Message from './components/Message';
import ChatModal from './components/ChatModal';

// Main Chat Application Component
const ChatApplication = () => {
  const [message, setMessage] = useState('');
  const [updateChat, setUpdateChat] = useState<ChatType | null>(null);
  const [openAddChat, setOpenAddChat] = useState<boolean>(false);
  const [searchUserChat, setSearchUserChat] = useState<string>('');
  const [previews, setPreviews] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [mobileChatOpen, setMobileChatOpen] = useState<boolean>(true);

  const {
    onCreateOrGetChat,
    onFetchMessages,
    onSendMessage,
    setChats,
    setUnReadMessages,
    handleChatDeleted,
    handleMessageDelete,
    onCreateGroupChat,
    unReadMessages,
    sendMessageLoading,
    messagesLoading,
    chatsLoading,
    users,
    chats,
    messages,
    chat,
    setChat,
  } = useChat();

  const { user } = useSelector((state: RootState) => state.auth);

  // Memoized filtered users for search
  const filteredUsers = useMemo(() => {
    if (!searchUserChat) return [];
    return users.filter((i) => i?.fullName?.toLowerCase().includes(searchUserChat.toLowerCase()));
  }, [users, searchUserChat]);

  // Memoized handlers
  const handlePreviewAttachments = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 5); // Limit to max 5 files
    setPreviews(fileArray?.length ? fileArray.map((file) => URL.createObjectURL(file)) : []);
    setAttachments(fileArray);
  }, []);

  const handleRemoveAttachment = useCallback((index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSendMessage = useCallback(
    async (e: React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!message.trim()) return;

      await onSendMessage(message, attachments, chat?._id);
      setMessage('');
      setAttachments([]);
      setPreviews([]);
    },
    [message, attachments, chat?._id, onSendMessage]
  );

  const handleChatClick = useCallback(
    (chatItem: ChatType) => {
      setMobileChatOpen(true);
      socket.emit('joinChat', chatItem._id);
      setChat({ ...chatItem });
      onFetchMessages(chatItem._id);
      setUnReadMessages((prev) => prev.filter((n) => n.chat !== chatItem._id));
    },
    [setMobileChatOpen, setChat, onFetchMessages, setUnReadMessages]
  );

  const handleLeaveChat = useCallback(
    (chatId: string) => {
      setChats(chats?.length ? chats.filter((c) => c._id !== chatId) : []);
      if (chat?._id === chatId) {
        setChat(null);
      }
    },
    [setChats, chat?._id, setChat]
  );

  return (
    <div className='flex max-sm:flex-col h-full w-full'>
      {/* Chat Sidebar */}
      <div
        className={cn(
          'max-sm:w-full sm:w-1/3 min-w-[300px] h-full overflow-y-scroll',
          mobileChatOpen && chat?._id ? 'max-sm:hidden' : ''
        )}>
        {/* Chat Modal */}
        <ChatModal
          isOpen={openAddChat}
          onClose={() => {
            setOpenAddChat(false);
            setUpdateChat(null);
          }}
          chat={updateChat}
          users={users}
          onCreateGroupChat={onCreateGroupChat}
          onCreateOrGetChat={onCreateOrGetChat}
        />

        <div className='flex flex-col relative'>
          {/* Search Bar */}
          <div className='flex items-center relative p-2 shadow mb-3'>
            <Search size={18} className='absolute left-5' />
            <Input
              name='search'
              title='search chat user'
              placeholder='Search...'
              className='flex-1 outline-none pl-10'
              onChange={(e) => setSearchUserChat(e.target.value)}
              value={searchUserChat}
            />
            <button
              title={searchUserChat ? 'Close search' : 'Add new chat'}
              className='bg-indigo-600 rounded-r-xl absolute right-2 hover:opacity-80 text-white w-[100px] py-2 gap-2 flex items-center justify-center'
              onClick={() => (searchUserChat ? setSearchUserChat('') : setOpenAddChat(true))}>
              {searchUserChat ? <X size={18} /> : <Plus size={18} />}
              <span>{searchUserChat ? 'Close' : 'Add'}</span>
            </button>
          </div>

          {/* Search Results */}
          {searchUserChat && (
            <div className='flex flex-col gap-2 items-center justify-between border-b'>
              {filteredUsers.map((item) => (
                <button
                  onClick={() => {
                    onCreateOrGetChat(item._id);
                    setSearchUserChat('');
                  }}
                  className='text-left w-full flex gap-2 items-center hover:bg-indigo-100 p-2'
                  key={item?._id}>
                  <Avatar name={item?.fullName} avatarUrl={item?.avatar} />
                  <span>{item?.fullName}</span>
                </button>
              ))}
            </div>
          )}

          {chatsLoading ? <Loading /> : null}

          {/* Chat List */}
          {Array.isArray(chats) &&
            chats.map((item) => (
              <ChatItem
                key={item?._id}
                item={item}
                user={user}
                unreadCount={unReadMessages.filter((n) => n.chat === item._id).length}
                isActive={chat?._id === item?._id}
                onUpdate={() => {
                  setUpdateChat(item);
                  setOpenAddChat(true);
                }}
                onDelete={() => handleChatDeleted(item._id)}
                onLeave={handleLeaveChat}
                onClick={() => handleChatClick(item)}
              />
            ))}
        </div>
      </div>

      {/* Empty State */}
      {!chat?._id && (
        <div className='w-full max-sm:hidden flex items-center justify-center'>
          <p className='flex items-center h-[50vh] justify-center text-gray-500'>
            Select a chat to start messaging
          </p>
        </div>
      )}

      {/* Messages Area */}
      {chat?._id && (
        <div
          className={cn(
            'w-full max-sm:hidden overflow-y-auto flex flex-col',
            mobileChatOpen ? '!flex' : ''
          )}>
          {/* Chat Header */}
          <div className='py-2 px-4 flex items-center gap-3 top-0 sticky z-10 bg-white shadow-sm'>
            <button className='svg-btn !p-2' onClick={() => setMobileChatOpen(false)}>
              <ArrowLeft />
            </button>
            <Avatar
              name={getChatObjectMetadata(chat, user).title}
              avatarUrl={getChatObjectMetadata(chat, user).avatar}
            />
            <div>
              <p className='font-medium'>{getChatObjectMetadata(chat, user).title}</p>
              {chat.isGroupChat ? (
                <p className='text-xs font-light text-gray-500'>
                  Group {chat.participants?.length} members
                </p>
              ) : (
                <p className='text-xs font-light text-gray-500'>one-on-one chat</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 p-4 overflow-y-auto'>
            {messagesLoading ? <Loading /> : null}
            <div className='min-h-[80vh]'>
              {messages.map((item) => (
                <Message
                  key={item?._id}
                  item={item}
                  onDelete={() => handleMessageDelete(item?._id)}
                  sender={item?.sender?._id === user?._id}
                />
              ))}
              {!messages?.length && !messagesLoading && (
                <p className='text-center text-gray-500 mt-10'>No messages yet</p>
              )}
            </div>
          </div>

          {/* Attachment Previews */}
          {previews?.length > 0 && (
            <div className='w-full flex flex-wrap px-4 gap-2 items-center justify-center sticky bottom-14 bg-white/90 backdrop-blur-sm py-2'>
              {previews.map((preview, i) => (
                <div key={i} className='relative'>
                  <img
                    src={preview}
                    alt='attachment preview'
                    className='w-20 h-20 rounded object-cover'
                  />
                  <Trash2Icon
                    onClick={() => handleRemoveAttachment(i)}
                    size={16}
                    className='absolute top-1 right-1 text-red-600 cursor-pointer bg-white rounded-full p-1'
                  />
                </div>
              ))}
            </div>
          )}

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className='w-full sticky sm:bottom-0 bottom-12 p-2 bg-white/40'>
            <div className='h-[40px] w-full flex items-center gap-1'>
              <Input
                className='border-none outline outline-gray-300'
                name='message'
                placeholder='Enter a message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <label
                title='Attach files (max 5)'
                htmlFor='attachments'
                className='bg-indigo-600 text-white flex gap-2 rounded-lg px-4 h-full items-center hover:opacity-80'>
                <ImageUp size={16} />
                <small className='max-sm:hidden font-medium'>Upload</small>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handlePreviewAttachments}
                  id='attachments'
                  name='attachments'
                  className='hidden'
                />
              </label>
              <button
                disabled={sendMessageLoading}
                type='submit'
                className='bg-indigo-600 text-white flex gap-2 rounded-lg px-4 h-full items-center hover:opacity-80 disabled:opacity-50'>
                {sendMessageLoading ? (
                  <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full' />
                ) : (
                  <Send size={16} />
                )}
                <small className='max-sm:hidden font-medium'>Send</small>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatApplication;
