export interface CommentReply {
  id: string;
  author: string;
  avatar: string;
  role?: string;
  timestamp: string;
  content: string;
  likes: number;
  userLiked?: boolean;
}

export interface ForumComment {
  id: string;
  author: string;
  avatar: string;
  role?: string;
  timestamp: string;
  promptId: string;
  promptText: string;
  tag: string;
  content: string;
  likes: number;
  userLiked?: boolean;
  replies: CommentReply[];
}

export interface DiscussionPrompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
}
