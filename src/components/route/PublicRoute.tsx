import React from 'react';
import { getCookie } from '../../utils/CookieUtils';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = getCookie('accessToken');

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
