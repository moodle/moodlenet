import { create } from './create.endpoint'
import { edit } from './edit.endpoint'
import { read } from './read.endpoint'
import { setBackground } from './setBackground.endpoint'
import { trash } from './trash.endpoint'
declare module '..' {
  interface Scope {
    resource: resource
  }
}

export type resource = moo.persona.usecase<{
  create: create
  edit: edit
  read: read
  setBackground: setBackground
  trash: trash
}>

export const resource: moo.gate.provider.usecase<resource> = {
  create,
  edit,
  read,
  setBackground,
  trash,
}
