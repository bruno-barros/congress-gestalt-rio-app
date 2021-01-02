import {Status} from "../../abstract/abstract.d";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function isFormDisabled(abstractStatus: Status) {

  const {user} = useCurrentUser()
  if(user.canManageAbstracts()) return false
  return ['revision', 'synopsis_rejected', 'final_revision', 'rejected','pre_approved', 'approved'].indexOf(abstractStatus) !== -1
}
