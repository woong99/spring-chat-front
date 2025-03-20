import { FaUser } from 'react-icons/fa';

const ProfileImage = ({
  profileImageUrl,
  containerClassName,
  defaultIconTextSize,
  width,
  height,
}: {
  profileImageUrl?: string;
  containerClassName?: string | undefined;
  defaultIconTextSize: string;
  width: string;
  height: string;
}) => {
  return (
    <div className={`flex-shrink-0 ${containerClassName}`}>
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt='profileImage'
          className={`w-${width} h-${height} rounded-2xl`}
        />
      ) : (
        <div
          className={`w-${width} h-${height} rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center`}
        >
          <FaUser className={`text-indigo-500 ${defaultIconTextSize}`} />
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
