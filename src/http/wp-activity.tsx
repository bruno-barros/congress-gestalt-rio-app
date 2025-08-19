import { AxiosResponse } from "axios";
import { CheckUpActivitySchema, WpRestResponse } from "../types/restapi";
import { restApi, RESTVersion } from "./axios";
import { ActivitySchema, ActivityUserSchema } from "../types/activity.type";
import { UserInterface } from "../resources/user";

export default class WpActivity {
  static find(
    id: number
  ): Promise<AxiosResponse<WpRestResponse<ActivitySchema>>> {
    return restApi.get(`${RESTVersion.default().namespace}/activities/${id}`);
  }

  static findCheckin(id_uuid: number | string): Promise<
    AxiosResponse<
      WpRestResponse<CheckUpActivitySchema>
    >
  > {
    return restApi.get(
      `${RESTVersion.default().namespace}/activities/${id_uuid}/checkin`
    );
  }

  static doCheckin(id_uuid: number | string): Promise<
    AxiosResponse<
      WpRestResponse<CheckUpActivitySchema>
    >
  > {
    return restApi.post(
      `${RESTVersion.default().namespace}/activities/${id_uuid}/checkin`
    );
  }
  
  static adminUndoCheckin(id: number ): Promise<
    AxiosResponse<
      WpRestResponse<string>
    >
  > {
    return restApi.delete(
      `${RESTVersion.default().namespace}/activities/subscription/${id}/checkin`
    );
  }
    static adminDoCheckin(id: number ): Promise<
    AxiosResponse<
      WpRestResponse<string>
    >
  > {
    return restApi.post(
      `${RESTVersion.default().namespace}/activities/subscription/${id}/checkin`
    );
  }

  static list(args: {
    edition?: string;
    active?: 0 | 1;
    user_id?: number | string;// subscription for user
  }): Promise<AxiosResponse<WpRestResponse<ActivitySchema[]>>> {
    const qs = [];
    if (args?.edition) qs.push(`edition=${args.edition}`);
    if (args?.active) qs.push(`active=${args.active}`);
    if (args?.user_id) qs.push(`user_id=${args.user_id}`);
    return restApi.get(
      `${RESTVersion.default().namespace}/activities/?${qs.join("&")}`
    );
  }

  static create(args: {
    edition: string;
    group_id?: number;
    title_pt: string;
    title_es?: string;
    title_en?: string;
    start_at: string;
    end_at: string;
    description_pt?: string;
    description_es?: string;
    description_en?: string;
    workload: number;
    vacancies: number;
    certificate?: 0 | 1;
    venue_id?: number;
    room_id?: number;
    type_id?: string;
    topic_id?: string;
    active?: 0 | 1;
    tax_speakers?: string | number[] | string[];
    tax_plans?: string | number[] | string[];
    tax_group?: string;
  }): Promise<AxiosResponse<WpRestResponse<ActivitySchema>>> {
    return restApi.post(`${RESTVersion.default().namespace}/activities/`, args);
  }

  static update(
    id: number,
    args: {
      group_id?: number;
      title_pt?: string;
      title_es?: string;
      title_en?: string;
      start_at?: string;
      end_at?: string;
      description_pt?: string;
      description_es?: string;
      description_en?: string;
      workload?: number;
      vacancies?: number;
      certificate?: 0 | 1;
      venue_id?: number;
      room_id?: number;
      type_id?: string;
      topic_id?: string;
      active?: 0 | 1;
      tax_speakers?: string | number[] | string[];
      tax_plans?: string | number[] | string[];
      tax_group?: string;
    }
  ): Promise<AxiosResponse<WpRestResponse<ActivitySchema>>> {
    return restApi.put(
      `${RESTVersion.default().namespace}/activities/${id}`,
      args
    );
  }

  static delete(id: number): Promise<AxiosResponse<WpRestResponse<null>>> {
    return restApi.delete(
      `${RESTVersion.default().namespace}/activities/${id}`
    );
  }

  /**
   * Inscreve usuário na atividade
   * @param args
   * @returns
   */
  static subscribe(args: {
    activity_id: number;
    user_id: number;
  }): Promise<AxiosResponse<WpRestResponse<null>>> {
    return restApi.post(
      `${RESTVersion.default().namespace}/activities/${
        args.activity_id
      }/subscribe`,
      args
    );
  }
   /**
   * Inscreve TODOS usuários na atividade
   * @param args
   * @returns
   */
  static subscribeAll(args: {
    activity_id: number;
  }): Promise<AxiosResponse<WpRestResponse<ActivityUserSchema[]>>> {
    return restApi.post(
      `${RESTVersion.default().namespace}/activities/${
        args.activity_id
      }/subscribe_all`,
      args
    );
  }

  static unsubscribe(args: {
    activity_id: number;
    user_id: number;
  }): Promise<AxiosResponse<WpRestResponse<null>>> {
    return restApi.post(
      `${RESTVersion.default().namespace}/activities/${
        args.activity_id
      }/unsubscribe`,
      args
    );
  }
}
