import { signed_token } from '@moodle/lib-types'
import { confirmDelete } from './confirmDelete.endpoint'
import { request } from './request.endpoint'
declare module '..' {
  interface Scope {
    deleteIt: deleteIt
  }
}

export type deleteIt = moo.persona.usecase<
  {
    request: request
    confirmDelete: confirmDelete
  },
  {
    mailer: {
      myAccountDeletionConfirmation: {
        displayName: string
        confirmMyAccountDeletionToken: signed_token
      }
      goodby: {
        displayName: string
      }
    }
    jwtTokens: {
      confirmMyAccountDeletion: {
        userId: string
      }
    }
  }
>

export const deleteIt: moo.gate.provider.usecase<deleteIt> = {
  request,
  confirmDelete,
}
