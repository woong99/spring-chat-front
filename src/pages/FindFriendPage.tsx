import Friend from '../components/find-friend/Friend';
import Header from '../components/layout/Header';
import MyInfo from '../components/find-friend/MyInfo';

const FindFriendPage = () => {
  return (
    <div className='max-w-screen-md mx-auto h-full flex flex-col'>
      {/* 헤더 */}
      <Header title='친구찾기' />

      {/* 내 프로필 */}
      <MyInfo />

      <div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
        {/* 친구 목록 */}
        <div>
          <Friend />
          <Friend />
          <Friend />
          <Friend />
          <Friend />
          <Friend />
          <Friend />
        </div>
      </div>
    </div>
  );
};

export default FindFriendPage;
