import * as moo from 'moodle-domain'
import { getMine } from './read.usecase/getMine.endpoint'
export type Read = moo.DefUseCase<{ getMine: getMine }>
