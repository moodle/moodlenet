import { getMine, getMineGate } from './read.usecase/getMine.endpoint'
export type read = moo.persona.usecase<{ getMine: getMine }>

export const readGate: moo.gate.usecase<read> = {
  getMine: getMineGate,
}
