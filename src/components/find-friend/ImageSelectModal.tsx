import { FaImage, FaUndo } from 'react-icons/fa';
import { UpdateMyInfo, UseFlag } from '../../api/api';

const ImageSelectModal = ({
  fileInputRef,
  setIsImageModalOpen,
  updateMyInfoData,
  setUpdateMyInfoData,
  setPreviewUrl,
  setDefaultImageFlag,
}: {
  fileInputRef: React.RefObject<HTMLInputElement>;
  setIsImageModalOpen: (value: boolean) => void;
  updateMyInfoData: UpdateMyInfo;
  setUpdateMyInfoData: (value: UpdateMyInfo) => void;
  setPreviewUrl: (value: string | null) => void;
  setDefaultImageFlag: (value: UseFlag) => void;
}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl p-4 w-64 shadow-xl transform transition-all'>
        <div className='flex flex-col gap-3'>
          <h3 className='text-base font-semibold text-gray-800 text-center'>
            프로필 이미지 변경
          </h3>
          <div className='flex flex-col gap-2'>
            <button
              onClick={() => {
                fileInputRef?.current?.click();
                setIsImageModalOpen(false);
              }}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2'
            >
              <FaImage className='text-indigo-500 w-4 h-4' />
              <span className='font-medium text-gray-700 text-sm'>
                갤러리에서 선택
              </span>
            </button>
            <button
              onClick={() => {
                setUpdateMyInfoData({
                  ...updateMyInfoData,
                  profileImage: undefined,
                });
                setPreviewUrl(null);
                setDefaultImageFlag('Y');
                setIsImageModalOpen(false);
              }}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2'
            >
              <FaUndo className='text-gray-500 w-4 h-4' />
              <span className='font-medium text-gray-700 text-sm'>
                기본 이미지로 변경
              </span>
            </button>
          </div>
          <button
            onClick={() => setIsImageModalOpen(false)}
            className='w-full px-3 py-2 text-gray-500 hover:text-gray-700 font-medium transition-colors rounded-lg text-sm'
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelectModal;
