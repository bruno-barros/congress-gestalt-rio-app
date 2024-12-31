import SearchAuthor from '../../components/abstract/authors/search-author';
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
  bio2: string;
  bio3: string;
  url?: string;
  _active?: boolean|undefined;
  _main?: boolean|undefined;
}


export interface SearchAuthorSchema {
    id: number;
    name: string
    email: string
    isSubscribed: boolean
    obs: string
}