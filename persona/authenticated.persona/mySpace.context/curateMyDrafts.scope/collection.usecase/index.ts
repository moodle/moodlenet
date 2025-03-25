import { create } from './create.endpoint'
import { edit } from './edit.endpoint'
import { read } from './read.endpoint'
import { setBackground } from './setBackground.endpoint'
import { trash } from './trash.endpoint'
declare module '..' {
  interface Scope {
    collection: collection
  }
}

export type collection = moo.persona.usecase<{
  create: create
  edit: edit
  read: read
  setBackground: setBackground
  trash: trash
}>

export const collection: moo.gate.provider.usecase<collection> = {
  create,
  edit,
  read,
  setBackground,
  trash,
}
