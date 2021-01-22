import jwtDecode from "jwt-decode";
import Cookie from "js-cookie";
import Router from "next/router";
import {redirectToLogin} from "../helpers";

const TOKEN_STORAGE_KEY = "nextapp.authToken";
const REFRESH_TOKEN_STORAGE_KEY = "nextapp.refreshToken";

export type DecodedToken = {
  readonly id: null | number;
  readonly exp: number;
}

export default class AuthToken {
  readonly decodedToken: DecodedToken;

  constructor(readonly token?: string, refreshToken?: string) {
    // we are going to default to an expired decodedToken
    this.decodedToken = {id: null, exp: 0};

    // then try and decode the jwt using jwt-decode
    try {
      if (token) {
        let decoded = jwtDecode(token);
        this.decodedToken = {
          exp: decoded.exp,
          id: decoded.data.user.id
        };
      }
    } catch (e) {
    }
  }

  tokenExists(): boolean{
    return !!AuthToken.getToken();
  }

  static getToken(){
    return Cookie.get(TOKEN_STORAGE_KEY)
  }

  static getRefreshToken(){
    return Cookie.get(REFRESH_TOKEN_STORAGE_KEY)
  }

  static deleteToken(){
    Cookie.remove(REFRESH_TOKEN_STORAGE_KEY);
    return Cookie.remove(TOKEN_STORAGE_KEY)
  }

  static factory() {
    return new AuthToken(Cookie.get(TOKEN_STORAGE_KEY));
  }

  get authorizationString() {
    return `Bearer ${this.token || Cookie.get(TOKEN_STORAGE_KEY)}`;
  }

  get expiresAt(): Date {
    return new Date(this.decodedToken.exp * 1000);
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isValid(): boolean {
    return !this.isExpired;
  }

  /**
   *
   * @param token
   * @param redirectTo '/'
   */
  static async storeToken(token: string, redirectTo: string | null = '/') {
    Cookie.set(TOKEN_STORAGE_KEY, token);
    if (redirectTo) {
      await Router.push(redirectTo);
    }
  }

  static storeRefreshToken(token: string ){
    Cookie.set(REFRESH_TOKEN_STORAGE_KEY, token);
  }

  static async logout(shouldRedirect: boolean = true) {
    Cookie.remove(TOKEN_STORAGE_KEY);
    if (shouldRedirect) {
      await redirectToLogin();
    }
  };

   almostExpired() {
    // get expire date
     var today:any = new Date();
     var expiresAt: any = this.expiresAt;
     var diffMs = (expiresAt - today); // milliseconds between now & Christmas
    // get diff from now
     var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
     // console.log('almost expires at', diffMins);
    // if less then 1 minute
    return diffMins < 1;
  }
}
