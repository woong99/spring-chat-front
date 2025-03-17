import React from 'react';
import { getCookie } from '../../utils/CookieUtils';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = getCookie('accessToken');
  const location = useLocation();

  if (!isAuthenticated) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    // state를 통해 이전 위치 정보를 전달
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
