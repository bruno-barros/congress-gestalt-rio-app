import { QueryClient, useQuery } from "react-query";
import WpUser from "../../src/http/wp-user";
import { User } from "../../src/resources/user";
import { errorNotification } from "../../src/resources/responses";

export default function useUser(id: number, appendQuery?: string) {
  function queryUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      WpUser.fetchUser(id, appendQuery).then((resp) => {
          if (resp.data?.data?.user) resolve(User.make(resp.data.data.user));
          else reject(null);
        }, (err) => {
          errorNotification({ error: err });
        }
      );
    });
  }

  return useQuery(["user", id, appendQuery], queryUser, {
    enabled: !!id,
  });
}

export function invalidateUser(queryClient: QueryClient, id?: number) {
    return queryClient.invalidateQueries(["user", id]);
}