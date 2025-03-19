import type { edit as editType } from '.'
import { role } from './role.core'
export const edit: moo.core.usecase<editType> = {
  role,
}
