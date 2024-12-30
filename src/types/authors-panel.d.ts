export interface AuthorSchema {
  id: number;
  uuid?: string
  active: 0 | 1;
  wp_user_id: number | null;
  is_speaker: 0 | 1;
  order: number;
  name: string;
  email: string;
  company: string;
  bio: string;
  url?: string;
}
