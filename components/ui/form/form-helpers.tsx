import {Status} from "../../abstract/abstract.d";

export default function isFormDisabled(abstractStatus: Status) {

  return ['synopsis_evaluating', 'synopsis_rejected', 'evaluating', 'rejected','pre_approved', 'approved'].indexOf(abstractStatus) !== -1
}
