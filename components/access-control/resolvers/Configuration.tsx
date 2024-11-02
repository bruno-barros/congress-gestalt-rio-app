import { User } from "../../../src/resources/user";

export const RESOLVERS = {
  manage: "Configuration:manage",
};

export default class Configuration {
  manage(user: User) {
    return user.isAdmin();
  }
}
