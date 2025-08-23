import Edition from "../../../src/resources/edition";
import { User } from "../../../src/resources/user";
import { AbstractType } from "../../abstract/abstract.d";

export const RESOLVERS = {
  read: "Abstract:read",
  manage: "Abstract:manage",
  submit: "Abstract:submit",
  readAttachments: "Abstract:readAttachments",
};

export default class Abstract {
  read(user: User, args?: { edition?: Edition }) {
    if (args?.edition && args.edition?.abstract?.test_mode == "1") {
      return user.isAdmin() || user.isSupervisor() || user.isEvaluator();
    }
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
    const testMode = args?.edition?.abstract?.test_mode === "1";
    const onlySubscribed = args?.edition?.abstract?.only_subscribed === "1";
    const isSubscribed =
      typeof args?.isSubscribed === "boolean" ? args?.isSubscribed : false;
    // console.log({ onlySubscribed, isSubscribed, abs:  args?.edition?.abstract });
    if (testMode) {
      return user.isAdmin() || user.isSupervisor() || user.isEvaluator();
    }
    if (onlySubscribed) {
      return isSubscribed;
    }
    return user.isParticipant() || user.isEvaluator() || user.isAdmin();
  }

  manage(user: User) {
    return (
      user.isAdmin() ||
      user.isSupervisor() ||
      user.isSuperAdmin()
    );
  }

  readAttachments(user: User) {
    return user.isAdmin() || user.isSupervisor() || user.isSuperAdmin();
  }
}
