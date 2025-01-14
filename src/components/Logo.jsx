import PropTypes from 'prop-types';

const Logo = ({ className = 'h-24 w-auto' }) => {
  return (
    <svg
      className={className}
      viewBox='0 0 120 120'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* 배경 원 */}
      <circle cx='60' cy='60' r='50' className='fill-indigo-100/50' />

      {/* 왼쪽 말풍선 */}
      <path
        d='M20 40C20 31.7157 26.7157 25 35 25H55C63.2843 25 70 31.7157 70 40V50C70 58.2843 63.2843 65 55 65H45L35 75V65C26.7157 65 20 58.2843 20 50V40Z'
        className='fill-indigo-500'
      />

      {/* 오른쪽 말풍선 */}
      <path
        d='M50 55C50 46.7157 56.7157 40 65 40H85C93.2843 40 100 46.7157 100 55V65C100 73.2843 93.2843 80 85 80H75L65 90V80C56.7157 80 50 73.2843 50 65V55Z'
        className='fill-indigo-600'
      />

      {/* 작은 원 장식들 */}
      <circle cx='35' cy='45' r='4' className='fill-white' />
      <circle cx='45' cy='45' r='4' className='fill-white' />
      <circle cx='55' cy='45' r='4' className='fill-white' />

      <circle cx='65' cy='60' r='4' className='fill-white' />
      <circle cx='75' cy='60' r='4' className='fill-white' />
      <circle cx='85' cy='60' r='4' className='fill-white' />
    </svg>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
};

export default Logo;
