import instance from './axios';

export type AuthInfo = {
  id: number;
  userId: string;
  nickname: string;
  profileImageUrl: string;
  introduction: string;
};

export type UseFlag = 'Y' | 'N';
export type FriendshipStatus = 'FRIEND' | 'BLOCKED';
export type FriendshipStatusFilter = 'ALL' | 'FRIEND' | 'BLOCKED';

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
  friendshipStatus?: FriendshipStatus;
};

export type ChangeFriendshipStatus = {
  friendId: number;
  status: FriendshipStatus;
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
    searchQuery?: string,
    filter?: FriendshipStatusFilter
  ): Promise<ScrollPagingResponse<AllFriendInfo>> {
    const response = await instance.get(`/friends`, {
      params: {
        page,
        searchQuery,
        filter,
      },
    });
    return response.data.data;
  }

  static async changeFriendshipStatus(
    data: ChangeFriendshipStatus
  ): Promise<void> {
    const response = await instance.put(`/friends/status`, data);
    return response.data.data;
  }
}
