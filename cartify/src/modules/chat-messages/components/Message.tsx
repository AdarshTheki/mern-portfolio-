import React, { useState } from 'react';
import type { MessageType } from '../../../types/ChatMessages';
import { cn, formatChatTime } from '../../../utils';
import { Trash2Icon } from 'lucide-react';
import { ImagePreview } from '../../../components';

type MessageProps = {
  item: MessageType;
  onDelete: () => void;
  sender: boolean;
};

// Optimized Message Component with React.memo
const Message: React.FC<MessageProps> = React.memo(({ item, onDelete, sender }) => {
  const [imageOpen, setImageOpen] = useState('');

  return (
    <div className={cn('flex flex-col gap-2 mb-2', !sender ? 'justify-start' : 'items-end')}>
      <div
        className={cn(
          'relative cursor-pointer group w-fit py-2 px-5 shadow',
          sender
            ? '!bg-indigo-100 rounded-l-4xl rounded-t-4xl'
            : 'bg-white rounded-r-4xl rounded-b-4xl'
        )}>
        <button
          onClick={onDelete}
          className='text-red-600 hidden group-hover:block absolute right-2 top-1 p-2 rounded-full bg-white'>
          <Trash2Icon size={18} />
        </button>
        <div className='flex gap-2 items-end'>
          {item?.content && <p>{item?.content}</p>}
          <small className='text-nowrap' style={{ fontWeight: 400 }}>
            {formatChatTime(item?.updatedAt)}
          </small>
        </div>
        {item?.attachments?.length > 0 && (
          <div className='grid grid-cols-2 gap-2 max-w-[200px]'>
            {item.attachments.map((attachment, index) => (
              <div key={index} onClick={() => setImageOpen(attachment)}>
                <img
                  src={attachment}
                  alt={`attachment-${index}`}
                  className='aspect-square w-full border border-gray-300 object-cover'
                  loading='lazy'
                />
              </div>
            ))}
          </div>
        )}
        <ImagePreview preview={imageOpen} closePreview={() => setImageOpen('')} />
      </div>
    </div>
  );
});

export default Message;
