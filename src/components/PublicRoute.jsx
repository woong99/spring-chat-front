import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCookie } from '../utils/CookieUtils';

const PublicRoute = ({ children }) => {
  const isAuthenticated = getCookie('accessToken');

  if (isAuthenticated) {
    // 이미 로그인된 경우 메인 페이지로 리다이렉트
    return <Navigate to='/' replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
