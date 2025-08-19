import { RESOLVERS as Configuration } from "./resolvers/Configuration";
import { RESOLVERS as User } from "./resolvers/User";
import { RESOLVERS as Abstract } from "./resolvers/Abstract";
import { RESOLVERS as Subscription } from "./resolvers/Subscription";
import { RESOLVERS as Activity } from "./resolvers/Activity";

export const REQUIREMENTS = {
  configuration: Configuration,
  user: User,
  abstract: Abstract,
  subscription: Subscription,
  activity: Activity,
};
