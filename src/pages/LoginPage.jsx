import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/CookieUtils';

const LoginPage = () => {
  const [userId, setUserId] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const signup = () => {
    axios
      .post('http://localhost:8080/api/v1/auth/login', {
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
        alert(error.response.data.message); // TODO : 에러 처리
      });
  };

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <img
          alt='Your Company'
          src='https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600'
          className='mx-auto h-10 w-auto'
        />
        <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
          로그인
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form action='#' method='POST' className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm/6 font-medium text-gray-900 text-left'
            >
              아이디
            </label>
            <div className='mt-2'>
              <input
                id='email'
                name='email'
                type='email'
                required
                autoComplete='email'
                className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm/6 font-medium text-gray-900'
              >
                비밀번호
              </label>
            </div>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                required
                autoComplete='current-password'
                className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type='button'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={signup}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
