import * as moo from 'moodle-domain'
import { getMine } from './userAccess.usecase/getMine.endpoint'
export type UserAccess = moo.DefUseCase<{ getMine: getMine }>
