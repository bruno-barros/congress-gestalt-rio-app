export interface WpRestResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
