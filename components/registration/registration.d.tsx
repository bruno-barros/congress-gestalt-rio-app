import {User} from "../../src/resources/user";
import Event, {Edition} from "../../src/resources/event";

export interface StepProps {
  user: User
  event: Event
  edition: Edition
  onLoading: (isLoading: boolean) => void
  goNext?: () => void
  goPrev?: () => void
}
