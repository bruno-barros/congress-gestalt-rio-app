
interface Ui {
  blockui: boolean;
}

export interface RootReducers {
  user: any;
  ui: Ui;
  form: any;
}


export interface LoginInputs {
  login: string;
  password: string;
}

export interface ErrorMessage {
  code: string|number;
  msg: string;
}
