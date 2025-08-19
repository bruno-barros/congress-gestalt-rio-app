import { User } from "../../../src/resources/user";

export const RESOLVERS = {
  read: "Subscription:read",
};

export default class Subscription {
  read(user: User) {
    return (
      user.isAdmin() ||
      user.isShopManager()
    );
  }
}
