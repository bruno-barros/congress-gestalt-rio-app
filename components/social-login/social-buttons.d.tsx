import Error from "../../src/resources/error";

export type Providers = 'google' | 'facebook'

export interface SocialLoginButtonProps {
  onSuccess:(user, provider: Providers) => void
  onFailed:(error: Error, provider: Providers) => void
}
