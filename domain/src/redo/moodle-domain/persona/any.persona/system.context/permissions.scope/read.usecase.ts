import * as moo from 'moodle-domain'
import { getMine, getMine_Gate } from './read.usecase/getMine.endpoint'
export type Read = moo.DefUseCase<{ getMine: getMine }>

export const Read_Gate: moo.Gate_UseCase<Read> = {
  getMine: getMine_Gate,
}
