import Edition from "../../../src/resources/edition";
import { User } from "../../../src/resources/user";

export const RESOLVERS = {
  read: "Evaluation:read",
  evaluate: "Evaluation:evaluate",
  manage: "Evaluation:manage",
};

export default class Evaluation {
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
  evaluate(user: User, args?: { edition?: Edition; isSubscribed?: boolean }) {    
    return user.isEvaluator() || user.isAdmin();
  }

  manage(user: User) {
    return (
      user.isAdmin()
    );
  }

}
