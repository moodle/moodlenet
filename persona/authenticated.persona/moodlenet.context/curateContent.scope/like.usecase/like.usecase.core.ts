import type { like as likeType } from '.'
import { resource } from './resource.core'
export const like: moo.core.usecase<likeType> = {
  resource,
}
