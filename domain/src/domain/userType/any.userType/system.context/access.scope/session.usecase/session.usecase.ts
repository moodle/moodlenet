import { myOwn } from './myOwn.endpoint'

export type session = moo.def.userType.usecase<{
  myOwn: myOwn
}>
export const session: moo.def.gate.provider.usecase<session> = {
  myOwn,
}
