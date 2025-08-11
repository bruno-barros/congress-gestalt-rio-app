import { ActivitySchema, ActivityUserSchema } from "./activity.type";

export interface WpRestResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CheckUpActivitySchema {
  activity: ActivitySchema;
  user: {
    ID: number;
    user_login: string;
    user_email: string;
    user_registered: string;
    display_name: string;
    locale: string;
    cpf?: string | null;
  };
  subscription: ActivityUserSchema;
  allowed_to_checkin: boolean;
  allowed_error: string;
  allowed_error_code: string;
}
