import {User} from "../../src/resources/user";
import Event, {Edition} from "../../src/resources/event";
import {FormikProps} from "formik";

export interface StepProps {
  step: {pt: string; en: string;}
  user: User
  event: Event
  edition: Edition
  onLoading: (isLoading: boolean) => void
  formInstance?: (instance: FormikProps<any>|null) => void
  goNext?: () => void
  goPrev?: () => void
}
