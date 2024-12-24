import  Edition  from "../../../src/resources/edition";
import { User } from "../../../src/resources/user";
import { AbstractType } from "../../abstract/abstract.d";

export const RESOLVERS = {
  read: "Abstract:read",
  manage: "Abstract:manage",
  submit: "Abstract:submit",
};

export default class Abstract {
  read(user: User, abstract?: AbstractType) {
    return (
      user.isParticipant() ||
      user.isEvaluator() ||
      user.isAdmin() ||
      user.isSupervisor() ||
      user.isShopManager()
    );
  }

  /**
   * Enviar trabalho
   * @param user
   * @returns
   */
  submit(user: User, args?: { edition?: Edition; isSubscribed?: boolean }) {
    const onlySubscribed = args?.edition?.abstract?.only_subscribed === "1";
    const isSubscribed = typeof args?.isSubscribed === 'boolean' ? args?.isSubscribed : false;
    // console.log({ onlySubscribed, isSubscribed, abs:  args?.edition?.abstract });
    if (onlySubscribed) {
      return isSubscribed;
    }
    return user.isParticipant() || user.isEvaluator() || user.isAdmin();
  }

  manage(user: User) {
    return user.isAdmin() || user.isSupervisor() || user.isSuperAdmin();
  }
}
