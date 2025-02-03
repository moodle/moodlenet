import { typ } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { UserAccess } from './systemAccess.scope/userAccess.usecase'

export type SystemAccess = moo.DefScope<{
  useCase: typ<SystemAccessUseCases>
  directives: null
}>

export interface SystemAccessUseCases {
  userAccess: UserAccess
}
