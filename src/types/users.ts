import { StringBoolean } from "./general";

/**
 * Usuário vindo do GraphQL
 */
export interface UserGraphQl {
  avatar?: {
    url: string;
  };
  databaseId: number;
  firstName: string;
  locale: string;
  name: string;
  email: string;
  cellphone: string;
  registeredDate: string;
  is_affirmative_action: StringBoolean;
  affirmative_action: string;
  roles: {
    nodes: {
      name: string;
    }[];
  };
}

export interface UserSearchResult {
  avatar?: {
    url: string;
  };
  databaseId: number;
  email: string;
  evaluations_pending_count: number;
  firstName: string;
  id: string;
  name: string;
}
