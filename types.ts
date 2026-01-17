
export interface User {
  user_id: number;
  username: string;
  email: string;
  bio: string;
  followers: number[];
  following: number[];
  profile_pic?: string;
}

export interface Post {
  post_id: number;
  user_id: number;
  content: string;
  media_url: string | null;
  likes: number[];
  comments: number[];
  hashtags: string[];
  timestamp: string;
}

export interface Comment {
  comment_id: number;
  post_id: number;
  user_id: number;
  content: string;
  timestamp: string;
}

export interface Story {
  story_id: number;
  user_id: number;
  media_url: string;
  timestamp: string;
}

export interface DirectMessage {
  dm_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  timestamp: string;
}

export interface FacetigramData {
  users: User[];
  posts: Post[];
  comments: Comment[];
  stories: Story[];
  direct_messages: DirectMessage[];
}

export type View = 'feed' | 'messages' | 'profile' | 'explore' | 'notifications';
