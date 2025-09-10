import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { errorHandler, axios } from '../utils';
import type { RootState } from '../store/store';
import type { AxiosError } from 'axios';

type HeartFavoriteProps = {
  id: string;
  className: string;
};

const HeartFavorite: React.FC<HeartFavoriteProps> = ({ id = '', className = '' }) => {
  const router = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(!!user?.favorite.includes(id));

  const handleLike = async () => {
    try {
      setLoading(true);
      if (!user?._id) return router('/login');

      const res = await axios.patch(`/user/favorite/${id}`);
      if (res.data) {
        const check = res.data?.data?.favorites.includes(id);
        setIsLiked(check);
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type='button'
      onClick={handleLike}
      className={`!bg-transparent ${className}`}
      title='favorite'>
      {loading ? (
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full border-t-2 border-blue-1 border-solid h-5 w-5'></div>
        </div>
      ) : (
        <Heart fill={`${isLiked ? 'red' : '#ff01'}`} stroke='red' className='h-5 w-5' />
      )}
    </button>
  );
};

export default HeartFavorite;
