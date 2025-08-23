import manage from "../../../pages/adm/manage";
import { User } from "../../../src/resources/user";

export const RESOLVERS = {
  read: "Activity:read",
  manage: "Activity:manage",
};

export default class Activity {
  read(user: User) {
    return user.isAdmin() || user.isSupport() || user.isShopManager();
  }
  /**
   * Altera, edita inscrições
   * @param user 
   * @returns 
   */
  manage(user: User) {
    return user.isAdmin() || user.isSupport() || user.isShopManager();
  }
}
