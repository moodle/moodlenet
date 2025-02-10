import { myOwn, myOwn_Gate } from './myOwn.endpoint'
export type get = moo.persona.usecase<{ myOwn: myOwn }>

export const get_Gate: moo.gate.usecase<get> = {
  myOwn: myOwn_Gate,
}
