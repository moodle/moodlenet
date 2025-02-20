import { curateInfo } from './curateInfo.scope/curateInfo.scope.core'
import type { organization as organizationType } from '.'
export const organization: moo.core.context<organizationType> ={
  curateInfo
}
