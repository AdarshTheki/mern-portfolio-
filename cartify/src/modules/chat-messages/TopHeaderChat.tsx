import { useNavigate, useLocation } from 'react-router-dom';
import { UserCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Avatar } from '../../components';
import { images } from '../../assets';
import type { RootState } from '../../store/store';

const NavbarTop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header className='sticky h-[10vh] flex items-center top-0 w-full z-50 bg-white/30 backdrop-blur-md shadow-md'>
      <div className='px-4 flex items-center justify-between w-full'>
        <div
          onClick={() => navigate('/')}
          className='text-xl font-bold text-gray-700 uppercase flex items-center cursor-pointer'>
          <img src={images.logo} className='w-8 h-6' />
          Cartify
        </div>

        <button
          onClick={() => navigate('/setting')}
          className='text-gray-700 hover:text-indigo-600 transition-colors duration-300'>
          {user?._id ? (
            <Avatar avatarUrl={user?.avatar} name={user?.fullName} className='scale-75' />
          ) : (
            <UserCircle2 />
          )}
        </button>
      </div>
    </header>
  );
};

export default NavbarTop;
