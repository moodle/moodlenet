import { create } from './create.endpoint'
import { edit } from './edit.endpoint'
import { read } from './read.endpoint'
import { setBackgroundImage } from './setBackgroundImage.endpoint'
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
  setBackgroundImage: setBackgroundImage
  trash: trash
}>

export const collection: moo.gate.usecase<collection> = {
  create,
  edit,
  read,
  setBackgroundImage,
  trash,
}
