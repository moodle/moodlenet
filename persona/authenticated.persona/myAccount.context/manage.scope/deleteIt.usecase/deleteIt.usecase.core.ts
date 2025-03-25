import type { deleteIt as deleteItType } from '.'
import { confirmDelete } from './confirmDelete.core'
import { request } from './request.core'
export const deleteIt: moo.core.usecase<deleteItType> = {
  confirmDelete,
  request,
}
