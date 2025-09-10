import { X } from 'lucide-react';
import React from 'react';

interface ImagePreviewProps {
  preview: string | null;
  closePreview: () => void;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = React.memo(
  ({ preview, closePreview, className = '' }) => {
    if (!preview) return null;

    return (
      <div
        className={`fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-md z-[100] ${className}`}
        role='dialog'
        aria-modal='true'>
        <div className='relative max-w-[90%] max-h-[90vh] bg-white rounded shadow-lg overflow-hidden animate-in fade-in zoom-in-95'>
          {/* Close Button */}
          <button
            type='button'
            onClick={closePreview}
            aria-label='Close image preview'
            className='absolute top-3 right-3 text-gray-700 hover:text-gray-900 bg-white p-1 rounded-full shadow-md transition hover:bg-gray-100'>
            <X size={24} />
          </button>

          {/* Image */}
          <img
            src={preview}
            alt='Preview'
            className='w-full h-auto max-h-[80vh] object-contain bg-gray-100'
          />
        </div>
      </div>
    );
  }
);

export default ImagePreview;
