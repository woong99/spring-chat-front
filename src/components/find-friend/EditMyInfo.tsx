import { FaCamera, FaTimes, FaUser } from 'react-icons/fa';
import { useState, useRef } from 'react';
import { Api, AuthInfo, UpdateMyInfo, UseFlag } from '../../api/Api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ImageSelectModal from './ImageSelectModal';
import { MoonLoader } from 'react-spinners';
import { AxiosError } from 'axios';
import CommonModal from '../common/CommonModal';

const EditMyInfo = ({
  isModalOpen,
  closeModal,
  authInfo,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  authInfo: AuthInfo | undefined;
}) => {
  const queryClient = useQueryClient();

  const { mutate: updateMyInfo, isPending: isLoading } = useMutation({
    mutationFn: (data: FormData) => Api.updateMyInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authInfo'] });
      closeModal();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || '프로필 업데이트에 실패했습니다.';
      toast.error(errorMessage);
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updateMyInfoData, setUpdateMyInfoData] = useState<UpdateMyInfo>({
    nickname: authInfo?.nickname || '',
    introduction: authInfo?.introduction || '',
    profileImage: undefined,
    defaultImageFlag: 'N',
  });
  const [defaultImageFlag, setDefaultImageFlag] = useState<UseFlag>('N');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(
    null
  ) as React.RefObject<HTMLInputElement>;

  // 이미지 선택 모달 상태 추가
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // 프로필 수정 버튼 클릭 시 실행
  const handleEdit = () => {
    setUpdateMyInfoData({
      nickname: authInfo?.nickname || '',
      introduction: authInfo?.introduction || '',
      profileImage: undefined,
      defaultImageFlag: 'N',
    });
    setIsEditing(true);
  };

  // 프로필 수정 API 호출
  const handleSave = () => {
    if (!updateMyInfoData.nickname) {
      toast.error('닉네임을 입력해주세요.');
      return;
    }

    const formData = new FormData();

    const jsonData = {
      nickname: updateMyInfoData.nickname,
      introduction: updateMyInfoData.introduction,
      defaultImageFlag: defaultImageFlag,
    };

    formData.append(
      'request',
      new Blob([JSON.stringify(jsonData)], {
        type: 'application/json',
      })
    );

    if (updateMyInfoData.profileImage) {
      formData.append('profileImage', updateMyInfoData.profileImage);
    }

    updateMyInfo(formData);
  };

  // 프로필 이미지 선택 시 실행
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpdateMyInfoData({
        ...updateMyInfoData,
        profileImage: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 클릭 시 실행
  const handleImageClick = () => {
    setDefaultImageFlag('N');
    setIsImageModalOpen(true);
  };

  const renderProfileImage = () => {
    if (isEditing) {
      if (defaultImageFlag === 'Y') {
        return (
          <div className='w-24 h-24 rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center'>
            <FaUser className='text-indigo-500 text-4xl' />
          </div>
        );
      } else {
        if (previewUrl || authInfo?.profileImageUrl) {
          return (
            <img
              src={previewUrl || authInfo?.profileImageUrl}
              alt='프로필 이미지'
              className='w-24 h-24 rounded-2xl object-cover'
            />
          );
        } else {
          return (
            <div className='w-24 h-24 rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center'>
              <FaUser className='text-indigo-500 text-4xl' />
            </div>
          );
        }
      }
    } else {
      if (previewUrl || authInfo?.profileImageUrl) {
        return (
          <img
            src={previewUrl || authInfo?.profileImageUrl}
            alt='프로필 이미지'
            className='w-24 h-24 rounded-2xl object-cover'
          />
        );
      } else {
        return (
          <div className='w-24 h-24 rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center'>
            <FaUser className='text-indigo-500 text-4xl' />
          </div>
        );
      }
    }
  };

  return (
    <>
      <CommonModal isOpen={isModalOpen} closeModal={closeModal}>
        <div className='flex flex-col gap-6 relative'>
          {isLoading && (
            <div className='absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3 rounded-2xl animate-fadeIn'>
              <MoonLoader color='#4f46e5' size={48} speedMultiplier={0.8} />
            </div>
          )}
          <div className='flex items-center justify-between'>
            <button
              onClick={() => {
                closeModal();
                setIsEditing(false);
                setUpdateMyInfoData({
                  ...updateMyInfoData,
                  profileImage: undefined,
                });
                setPreviewUrl(null);
              }}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <FaTimes className='w-6 h-6' />
            </button>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              {renderProfileImage()}
              {isEditing && (
                <>
                  <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept='image/*'
                    className='hidden'
                  />
                  <button
                    onClick={handleImageClick}
                    className='absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow hover:scale-110'
                  >
                    <FaCamera className='w-5 h-5 text-gray-500' />
                  </button>
                </>
              )}
            </div>
            <div className='text-center'>
              {isEditing ? (
                <input
                  type='text'
                  value={updateMyInfoData.nickname}
                  onChange={(e) =>
                    setUpdateMyInfoData({
                      ...updateMyInfoData,
                      nickname: e.target.value,
                    })
                  }
                  className='text-xl font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-center w-full'
                  autoFocus
                  spellCheck={false}
                  maxLength={10}
                />
              ) : (
                <h3 className='text-xl font-semibold text-gray-800'>
                  {authInfo?.nickname}
                </h3>
              )}
              {isEditing ? (
                <textarea
                  value={updateMyInfoData.introduction}
                  onChange={(e) => {
                    setUpdateMyInfoData({
                      ...updateMyInfoData,
                      introduction: e.target.value,
                    });
                    // 높이 자동 조절
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  className='text-gray-500 mt-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-center w-full resize-none overflow-hidden'
                  rows={1}
                  autoFocus
                  spellCheck={false}
                  maxLength={30}
                />
              ) : (
                <p className='text-gray-500 mt-1'>{authInfo?.introduction}</p>
              )}
            </div>
          </div>

          <div className='w-full border-t border-gray-100 pt-4 mt-4'>
            <div className='flex justify-center gap-3'>
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setUpdateMyInfoData({
                        ...updateMyInfoData,
                        profileImage: undefined,
                      });
                      setPreviewUrl(null);
                    }}
                    className='px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-all duration-200 rounded-lg hover:bg-gray-50'
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className='px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105'
                  >
                    저장
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className='px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105'
                >
                  프로필 수정
                </button>
              )}
            </div>
          </div>
        </div>
      </CommonModal>

      {isImageModalOpen && (
        <ImageSelectModal
          fileInputRef={fileInputRef}
          setIsImageModalOpen={setIsImageModalOpen}
          updateMyInfoData={updateMyInfoData}
          setUpdateMyInfoData={setUpdateMyInfoData}
          setPreviewUrl={setPreviewUrl}
          setDefaultImageFlag={setDefaultImageFlag}
        />
      )}
    </>
  );
};

export default EditMyInfo;
