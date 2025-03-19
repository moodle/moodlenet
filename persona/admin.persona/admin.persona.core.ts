import { moodlenet } from './moodlenet.context/moodlenet.context.core'
import { organization } from './organization.context/organization.context.core'
import { userBase } from './userBase.context/userBase.context.core'
import type { admin as admin_def } from '.'
export const admin: moo.core.persona<admin_def> = {
  moodlenet,
  organization,
  userBase,
}
