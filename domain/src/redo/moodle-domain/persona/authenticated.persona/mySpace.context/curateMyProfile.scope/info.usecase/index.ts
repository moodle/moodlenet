import { edit } from './edit.endpoint'
import { read } from './read.endpoint'
import { setAvatar } from './setAvatar.endpoint'
import { setBackground } from './setBackground.endpoint'
declare module '..' {
  interface Scope {
    info: info
  }
}

export type info = moo.persona.usecase<{
  edit: edit
  read: read
  setAvatar: setAvatar
  setBackground: setBackground
}>

export const info: moo.gate.provider.usecase<info> = {
  edit,
  read,
  setAvatar,
  setBackground,
}
