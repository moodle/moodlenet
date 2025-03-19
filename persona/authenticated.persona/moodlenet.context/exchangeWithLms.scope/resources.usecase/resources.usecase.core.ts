import type { resources as resourcesType } from '.'
import { send } from './send.core'
export const resources: moo.core.usecase<resourcesType> = {
  send,
}
