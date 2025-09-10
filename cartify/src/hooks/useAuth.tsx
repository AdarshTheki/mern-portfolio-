import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { axios } from '../utils';
import { login, logout } from '../store/authSlice';
import type { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import type { UserType } from '../types/User';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<null | string>(null);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  // const setErrorHandler = (error: AxiosResponseType) => {
  //   const { message, statusCode } = error || {};
  //   if (message) {
  //     if (statusCode === 401) {
  //       setIsError('Unauthorized access. Please login again.');
  //     } else if (statusCode === 403) {
  //       setIsError("Forbidden. You don't have permission.");
  //     } else if (statusCode === 404) {
  //       setIsError('Requested resource not found.');
  //     } else {
  //       setIsError(message);
  //     }
  //   } else {
  //     setIsError(message || 'An unexpected error occurred.');
  //   }
  // };

  const handleLogin = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      setIsError(null);
      setLoginLoading(true);
      if (!email || !password) {
        setIsError('Please fill in all fields.');
        return;
      }

      const res = await axios.post('/user/sign-in', { email, password });
      const data = res?.data?.data;
      if (data) {
        if (rememberMe) {
          localStorage.setItem('accessToken', data.accessToken);
          sessionStorage.removeItem('accessToken');
        } else {
          sessionStorage.setItem('accessToken', data.accessToken);
          localStorage.removeItem('accessToken');
        }
        window.location.href = '/';
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setRegisterLoading(true);
      if (!fullName || !email || !password || !confirmPassword) {
        setIsError('Please fill in all fields.');
        return;
      }

      if (password !== confirmPassword) {
        setIsError('Passwords do not match.');
        return;
      }

      const { data } = await axios.post('/user/sign-up', {
        fullName,
        email,
        password,
        role: 'customer',
      });
      if (data) {
        navigate('/login');
        toast.success('check your email to verify users');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdateProfile = async (fullName: string, phoneNumber: string) => {
    try {
      const res = await axios.patch('/user/update', {
        fullName,
        phoneNumber,
      });
      const data = res?.data?.data;
      if (data) {
        dispatch(login({ ...user, fullName, phoneNumber } as UserType));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await axios.post('/user/avatar', formData);
      const data = res?.data?.data;
      if (data) {
        dispatch(login({ ...user, avatar: data.avatar } as UserType));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    await axios.post('/user/logout');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
  };

  const handleResendVerifyUser = async () => {
    try {
      const res = await axios.get('/user/resend-verify-email');
      if (res.data) {
        toast.success('Mail has been sent to your mail ID');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    user,
    avatarLoading,
    registerLoading,
    loginLoading,
    isError,
    handleResendVerifyUser,
    handleUpdateProfile,
    handleUploadAvatar,
    handleLogout,
    handleRegister,
    handleLogin,
  };
};

export default useAuth;
