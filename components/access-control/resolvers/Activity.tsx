import { User } from "../../../src/resources/user";

export const RESOLVERS = {
  read: "Activity:read",
};

export default class Activity {
  read(user: User) {
    return user.isAdmin() || user.isSupervisor() || user.isShopManager();
  }
}
