import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const SignUpPage = () => {
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
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
      });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-md mx-auto h-screen flex flex-col bg-white shadow-lg'>
        {/* 헤더 */}
        <div className='bg-white px-4 py-5 flex items-center border-b relative shadow-sm'>
          <span className='font-semibold flex-1 text-center text-lg'>
            회원가입
          </span>
        </div>

        {/* 컨텐츠 */}
        <div className='flex-1 p-6'>
          <div className='flex flex-col items-center mb-8'>
            <Logo />
          </div>

          <form onSubmit={handleSignup} className='space-y-4'>
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
                htmlFor='nickname'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                닉네임
              </label>
              <input
                id='nickname'
                name='nickname'
                type='text'
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors'
                placeholder='닉네임을 입력하세요'
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
              회원가입
            </button>
          </form>

          <div className='mt-6 text-center'>
            <span className='text-sm text-gray-600'>
              이미 계정이 있으신가요?{' '}
            </span>
            <button
              onClick={() => navigate('/login')}
              className='text-sm text-indigo-600 font-medium hover:text-indigo-500'
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
