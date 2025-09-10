import { useEffect, useRef, useState } from 'react';
import { useApi } from './index';
import { axios, errorHandler, socket } from '../utils';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import type { ChatType, MessageType } from '../types/ChatMessages';
import type { UserType } from '../types/User';
import type { AxiosError } from 'axios';

const NEW_CHAT_EVENT = 'newChat';
const LEAVE_CHAT_EVENT = 'leaveChat';
const UPDATE_GROUP_NAME_EVENT = 'updateGroupName';
const MESSAGE_RECEIVED_EVENT = 'messageReceived';
const MESSAGE_DELETE_EVENT = 'messageDeleted';
const SOCKET_ERROR_EVENT = 'socketError';

const useChat = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const currentChat = useRef<ChatType | null>(null);
  const [chat, setChat] = useState<ChatType | null>(null);
  const [unReadMessages, setUnReadMessages] = useState<MessageType[]>([]);
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [mobileChatOpen, setMobileChatOpen] = useState<boolean>(true);
  const { data: users, callApi: callApiUsers } = useApi<{ docs: UserType[] }>();
  const {
    data: chats,
    callApi: callApiChats,
    loading: chatsLoading,
    setData: setChats,
  } = useApi<ChatType[]>();
  const {
    data: messages,
    callApi: callApiMessages,
    loading: messagesLoading,
    setData: setMessages,
  } = useApi<MessageType[]>();

  useEffect(() => {
    callApiUsers('/user/admin', {}, 'get');
    callApiChats('/chats', {}, 'get');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chat?._id) {
      currentChat.current = chat;
    }
  }, [chat?._id, chat]);

  const onSocketError = (message: string) => {
    toast.error(`${JSON.stringify(message)}`);
  };

  const onNewChat = (newChat: ChatType) => {
    setChats(chats?.length ? [newChat, ...chats] : [newChat]);
  };

  const onChatLeave = (leaveChat: ChatType) => {
    setChats(chats?.length ? chats.filter((c) => c._id !== leaveChat._id) : []);
    if (leaveChat._id === currentChat.current?._id) {
      setChat(null);
    }
  };

  const onGroupUpdate = (groupChat: ChatType) => {
    if (groupChat?._id === currentChat.current?._id) {
      // update chat details
    }
    setChats(
      chats?.length
        ? [
            ...chats.map((c) => {
              if (c._id === groupChat?._id) {
                return groupChat;
              }
              return c;
            }),
          ]
        : []
    );
  };

  const onMessageDelete = (message: MessageType) => {
    setMessages(messages?.length ? messages.filter((msg) => msg._id !== message._id) : []);
    // update chat last message
  };

  const onMessageRetrieved = (msg: MessageType) => {
    if (msg?.chat === currentChat.current?._id) {
      setMessages(messages?.length ? [...messages, msg] : [msg]);
    } else {
      setUnReadMessages(unReadMessages?.length ? [...unReadMessages, msg] : [msg]);
    }
  };

  const onFetchMessages = (chatId: string) => {
    callApiMessages(`/messages/${chatId}`, {}, 'get');
  };

  const onCreateOrGetChat = async (userId: string) => {
    try {
      const res = await axios.post(`/chats/chat/${userId}`);
      if (res.data) {
        setChat(res.data.chat);
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    }
  };

  const onCreateGroupChat = async (name: string, participants: string[] = [], chatId: string) => {
    try {
      const method = chatId ? 'patch' : 'post';
      const url = chatId ? `/chats/group/${chatId}` : '/chats/group';
      await axios[method](url, {
        name,
        participants,
      });
    } catch (error) {
      errorHandler(error as AxiosError);
    }
  };

  const onSendMessage = async (message: string, attachments: File[], chatId?: string) => {
    try {
      setSendMessageLoading(true);
      if (!message.trim()) return;

      const formData = new FormData();
      formData.append('content', message);

      if (attachments?.length > 0) {
        attachments?.forEach((_, i) => {
          formData.append('attachments', attachments[i]);
        });
      }
      await axios.post(`/messages/${chatId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setSendMessageLoading(false);
    }
  };

  const handleMessageDelete = async (messageId: string) => {
    try {
      await axios.delete(`/messages/${messageId}`);
    } catch (error) {
      errorHandler(error as AxiosError);
    }
  };

  const handleChatDeleted = async (chatId: string) => {
    try {
      await axios.delete(`/chats/chat/${chatId}`);
    } catch (error) {
      errorHandler(error as AxiosError);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(NEW_CHAT_EVENT, onNewChat);
    socket.on(LEAVE_CHAT_EVENT, onChatLeave);
    socket.on(UPDATE_GROUP_NAME_EVENT, onGroupUpdate);
    socket.on(MESSAGE_RECEIVED_EVENT, onMessageRetrieved);
    socket.on(MESSAGE_DELETE_EVENT, onMessageDelete);
    socket.on(SOCKET_ERROR_EVENT, onSocketError);

    return () => {
      socket.off(NEW_CHAT_EVENT, onNewChat);
      socket.off(LEAVE_CHAT_EVENT, onChatLeave);
      socket.off(UPDATE_GROUP_NAME_EVENT, onGroupUpdate);
      socket.off(MESSAGE_RECEIVED_EVENT, onMessageRetrieved);
      socket.off(MESSAGE_DELETE_EVENT, onMessageDelete);
      socket.off(SOCKET_ERROR_EVENT, onSocketError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return {
    onCreateGroupChat,
    onCreateOrGetChat,
    onFetchMessages,
    onSendMessage,
    setChats,
    setMessages,
    setChat,
    onSocketError,
    onChatLeave,
    onNewChat,
    onGroupUpdate,
    onMessageDelete,
    onMessageRetrieved,
    setUnReadMessages,
    handleMessageDelete,
    handleChatDeleted,
    setMobileChatOpen,
    mobileChatOpen,
    sendMessageLoading,
    messagesLoading,
    chatsLoading,
    unReadMessages,
    users: users?.docs?.filter((i) => i?._id !== user?._id) || [],
    chats: chats || [],
    messages: messages || [],
    chat,
  };
};

export default useChat;
