import { User } from "../../../src/resources/user";

export const RESOLVERS = {
  read: "UserProfile:read",
  edit: "UserProfile:edit",
  readSensitive: "UserProfile:readSensitive",
  editSensitive: "UserProfile:editSensitive",
};

export default class UserProfile {
  read(user: User) {
    return (
      user.isParticipant() ||
      user.isEvaluator() ||
      user.isAdmin() ||
      user.isSupervisor() ||
      user.isShopManager()
    );
  }

  edit(user: User) {
    return user.isAdmin();
  }

  readSensitive(user: User) {
    return user.isAdmin();
  }

  editSensitive(user: User) {
    return user.isAdmin();
  }
}
