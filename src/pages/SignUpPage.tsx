import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaUser, FaLock, FaUserTag, FaUserPlus } from 'react-icons/fa';

const SignUpPage = () => {
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    api
      .post('/auth/sign-up', {
        userId,
        nickname,
        password,
      })
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        alert(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out'>
        {/* 로고 영역 */}
        <div className='bg-indigo-600 px-6 py-8 text-center'>
          <div className='mb-3 flex justify-center'>
            <img src='logo.svg' alt='logo' className='w-20 h-20' />
          </div>
          <h1 className='text-white text-xl font-bold'>Potato Chat</h1>
        </div>

        {/* 폼 영역 */}
        <div className='p-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
            회원가입
          </h2>

          <form onSubmit={handleSignup} className='space-y-5'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaUser className='h-5 w-5 text-gray-400' />
              </div>
              <input
                id='userId'
                name='userId'
                type='text'
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200'
                placeholder='아이디를 입력하세요'
              />
            </div>

            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaUserTag className='h-5 w-5 text-gray-400' />
              </div>
              <input
                id='nickname'
                name='nickname'
                type='text'
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200'
                placeholder='닉네임을 입력하세요'
              />
            </div>

            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaLock className='h-5 w-5 text-gray-400' />
              </div>
              <input
                id='password'
                name='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200'
                placeholder='비밀번호를 입력하세요'
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-indigo-500 transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-md flex items-center justify-center gap-2 mt-2'
            >
              {isLoading ? (
                <span className='inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
              ) : (
                <>
                  <FaUserPlus className='h-5 w-5' />
                  <span>회원가입</span>
                </>
              )}
            </button>
          </form>

          <div className='mt-8 text-center'>
            <span className='text-sm text-gray-600'>
              이미 계정이 있으신가요?{' '}
            </span>
            <button
              onClick={() => navigate('/login')}
              className='text-sm text-indigo-600 font-medium hover:text-indigo-500 transition-colors'
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
