import { preferences } from './preferences.usecase/preferences.usecase.core'
import { send } from './send.usecase/send.usecase.core'
import type { email as emailType } from '.'
export const email: moo.core.scope<emailType> ={
  preferences,
  send
}
