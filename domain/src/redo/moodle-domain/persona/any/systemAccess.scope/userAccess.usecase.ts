import * as moo from 'moodle-domain'
import { getMine } from './myConfigs.usecase/getMine.endpoint'
export type UserAccess = moo.DefUseCase<{
  endpoint: {
    getMine: getMine
  }
  directives: null
}>
