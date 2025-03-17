import React, { useState } from 'react';
import api from '../api/axios.ts';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/CookieUtils.ts';
import Logo from '../components/Logo.tsx';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post('/auth/login', {
        userId,
        password,
      })
      .then((response) => {
        setCookie('accessToken', response.data.data.token, {
          path: '/',
          expires: new Date(response.data.data.expiresIn),
        });
        navigate('/');
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-md mx-auto h-screen flex flex-col bg-white shadow-lg'>
        {/* 헤더 */}
        <div className='bg-white px-4 py-5 flex items-center border-b relative shadow-sm'>
          <span className='font-semibold flex-1 text-center text-lg'>
            로그인
          </span>
        </div>

        {/* 컨텐츠 */}
        <div className='flex-1 p-6'>
          <div className='flex flex-col items-center mb-8'>
            <Logo />
          </div>

          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label
                htmlFor='userId'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                아이디
              </label>
              <input
                id='userId'
                name='userId'
                type='text'
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors'
                placeholder='아이디를 입력하세요'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                비밀번호
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors'
                placeholder='비밀번호를 입력하세요'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-indigo-500 transition-colors mt-6'
            >
              로그인
            </button>
          </form>

          <div className='mt-6 text-center'>
            <span className='text-sm text-gray-600'>계정이 없으신가요? </span>
            <button
              onClick={() => navigate('/signup')}
              className='text-sm text-indigo-600 font-medium hover:text-indigo-500'
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
