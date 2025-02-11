import { signed_token } from '@moodle/lib-types'
import { confirmDelete, confirmDelete_Gate } from './confirmDelete.endpoint'
import { request, request_Gate } from './request.endpoint'

export type deleteIt = moo.persona.usecase<{
  request: request
  confirmDelete: confirmDelete
  [moo.persona.usecase.modelTypes]: {
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
}>

export const deleteMyAccount_Gate: moo.gate.usecase<deleteIt> = {
  request: request_Gate,
  confirmDelete: confirmDelete_Gate,
}
