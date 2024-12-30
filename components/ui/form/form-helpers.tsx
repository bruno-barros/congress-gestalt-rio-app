import { StatusType } from "../../../src/types/abstracts";

export default function isFormDisabled(abstractStatus: StatusType) {

  return ['synopsis_evaluating', 'synopsis_rejected', 'evaluating', 'rejected','pre_approved', 'approved'].indexOf(abstractStatus) !== -1
}
