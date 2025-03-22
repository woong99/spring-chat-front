import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4'>
      <div className='text-center'>
        <div className='flex justify-center mb-4'>
          <FaExclamationTriangle className='text-yellow-500 w-16 h-16' />
        </div>
        <h1 className='text-4xl font-bold text-gray-800 mb-2'>404</h1>
        <h2 className='text-2xl font-medium text-gray-700 mb-4'>
          페이지를 찾을 수 없습니다
        </h2>
        <p className='text-gray-600 mb-8'>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          to='/friends'
          className='inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors'
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
