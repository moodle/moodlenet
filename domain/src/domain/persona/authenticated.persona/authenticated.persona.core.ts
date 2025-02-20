import { edu } from './edu.context/edu.context.core'
import { messaging } from './messaging.context/messaging.context.core'
import { moodlenet } from './moodlenet.context/moodlenet.context.core'
import { myAccount } from './myAccount.context/myAccount.context.core'
import { mySpace } from './mySpace.context/mySpace.context.core'
import type { authenticated as authenticatedType } from '.'
export const authenticated: moo.core.persona<authenticatedType> ={
  edu,
  messaging,
  moodlenet,
  myAccount,
  mySpace
}
