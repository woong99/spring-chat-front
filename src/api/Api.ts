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

export type AllFriendInfo = {
  id: number;
  nickname: string;
  profileImageUrl?: string;
  introduction?: string;
};

export interface ScrollPagingResponse<T> {
  data: T[];
  hasMore: boolean;
  page: number;
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

  static async getAllFriends(
    page: number,
    searchQuery?: string
  ): Promise<ScrollPagingResponse<AllFriendInfo>> {
    const response = await instance.get(`/friends`, {
      params: {
        page,
        searchQuery,
      },
    });
    return response.data.data;
  }
}
