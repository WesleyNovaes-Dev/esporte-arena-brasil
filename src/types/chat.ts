
export interface TeamMessage {
  id: string;
  content: string;
  sender_id: string;
  team_id: string;
  message_type: string;
  media_url?: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  reply_to_id?: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface PrivateMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  team_id: string;
  message_type: string;
  media_url?: string;
  is_read: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}
