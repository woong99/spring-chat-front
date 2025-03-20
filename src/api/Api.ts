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
export type ChatRoomType = 'PRIVATE' | 'GROUP';

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

export type ChatRoomId = {
  chatRoomId: string;
};

export type MyChatRoom = {
  chatRoomId: string;
  chatRoomName: string;
  chatRoomType: ChatRoomType;
  participantCount: number;
  unreadMessageCount: number;
  lastMessage: string;
  lastSendAt: string;
  profileImageUrl: string;
};

export type CreateGroupChatRoom = {
  friendIds: number[];
  chatRoomName: string;
};

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

  static async getPrivateChatRoomId(friendId: number): Promise<ChatRoomId> {
    const response = await instance.get(`/chat-room/private/${friendId}`);
    return response.data.data;
  }

  static async getMyChatRooms(): Promise<MyChatRoom[]> {
    const response = await instance.get('/chat-room/my-list');
    return response.data.data;
  }

  static async createGroupChatRoom(
    data: CreateGroupChatRoom
  ): Promise<ChatRoomId> {
    const response = await instance.post('/chat-room/group', data);
    return response.data.data;
  }
}
