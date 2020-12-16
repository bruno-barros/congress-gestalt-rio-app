import {httpServiceXYZ} from "../http/axios";
import {AxiosResponse} from "axios";

export default class Imdb {
  private key = 'c0534ff4';
  public static collectionKey = 'imdb';
  static async search(term: string): Promise<AxiosResponse<any>>{
    let that = new this;
    return await httpServiceXYZ.get(`/?apikey=${that.key}&type=movie&s=${term}`);
  }
}
