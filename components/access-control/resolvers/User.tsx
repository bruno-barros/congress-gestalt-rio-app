import { User } from "../../../src/resources/user";

export const RESOLVERS = {
  read: "UserProfile:read",
  edit: "UserProfile:edit",
  readSensitive: "UserProfile:readSensitive",
  editSensitive: "UserProfile:editSensitive",
  deleteDocuments: "UserProfile:deleteDocuments",
  switch: "UserProfile:switch",
};

export default class UserProfile {
  read(user: User) {
    return (
      user.isParticipant() ||
      user.isEvaluator() ||
      user.isAdmin() ||
      user.isSupervisor() ||
      user.isShopManager() ||
      user.isSupport()
    );
  }

  edit(user: User) {
    return user.isAdmin() || user.isSupport();
  }

  readSensitive(user: User) {
    return user.isAdmin();
  }

  editSensitive(user: User) {
    return user.isAdmin();
  }

  deleteDocuments(user: User) {
    return user.isAdmin();
  }

  switch(user: User) {
    return user.isSuperAdmin();
  }
}
