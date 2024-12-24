import {User} from "../../src/resources/user";
import Event  from "../../src/resources/event";
import {FormikProps} from "formik";
import Edition from "../../src/resources/edition";

export interface StepProps {
  step: {pt: string; en: string;}
  user: User
  event: Event
  edition: Edition
  onLoading: (isLoading: boolean) => void
  formInstance?: (instance: FormikProps<any>|any) => void
  goNext?: (step?: number) => void
  goPrev?: (step?: number) => void
}
