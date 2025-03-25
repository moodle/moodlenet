import { confirmDelete } from './confirmDelete.endpoint'
import { request } from './request.endpoint'
declare module '..' {
  interface Scope {
    deleteIt: deleteIt
  }
}

export type deleteIt = moo.persona.usecase<{
  request: request
  confirmDelete: confirmDelete
}>

export const deleteIt: moo.gate.provider.usecase<deleteIt> = {
  request,
  confirmDelete,
}
