import { User } from "../../../src/resources/user";
import { AbstractType } from "../../abstract/abstract.d";

export const RESOLVERS = {
    read: "Abstract:read",
};

export default class Abstract {
  read(user: User, abstract?: AbstractType) {
    return user.isParticipant() || user.isEvaluator() || user.isAdmin() || user.isSupervisor() || user.isShopManager();
  }

  submit(user: User) {
    return user.isAdmin();
  }
}
