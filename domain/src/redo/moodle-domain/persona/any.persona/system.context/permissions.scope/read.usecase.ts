import { getMine, getMineGate } from './read.usecase/getMine.endpoint'
export type read = moo.persona.usecase<{ getMine: getMine }, { _test: 10 }>

export const readGate: moo.gate.usecase<read> = {
  getMine: getMineGate,
}
