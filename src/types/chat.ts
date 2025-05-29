
export interface TeamMessage {
  id: string;
  team_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  media_url: string | null;
  reply_to_id: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface PrivateMessage {
  id: string;
  team_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  media_url: string | null;
  is_read: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}
