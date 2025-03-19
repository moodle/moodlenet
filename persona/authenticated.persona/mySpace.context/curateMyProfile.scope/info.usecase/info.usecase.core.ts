import type { info as infoType } from '.'
import { edit } from './edit.core'
import { read } from './read.core'
import { setAvatar } from './setAvatar.core'
import { setBackground } from './setBackground.core'
export const info: moo.core.usecase<infoType> = {
  edit,
  read,
  setAvatar,
  setBackground,
}
