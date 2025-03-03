import { preferences } from './preferences.usecase/preferences.usecase.core'
import { send } from './send.usecase/send.usecase.core'
import type { email as email_def } from '.'
export const email: moo.core.scope<email_def> = {
  preferences,
  send,
}
