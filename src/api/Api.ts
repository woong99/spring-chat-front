import instance from './axios';

export type AuthInfo = {
  id: number;
  userId: string;
  nickname: string;
  profileImageUrl: string;
  introduction: string;
};

export type UseFlag = 'Y' | 'N';

export interface UpdateMyInfo {
  nickname: string;
  introduction: string;
  profileImage?: File;
  defaultImageFlag: UseFlag;
}

export class Api {
  static async getMyInfo(): Promise<AuthInfo> {
    const response = await instance.get('/auth/me');
    return response.data.data;
  }

  static async updateMyInfo(formData: FormData): Promise<void> {
    const response = await instance.put('/auth/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
}
