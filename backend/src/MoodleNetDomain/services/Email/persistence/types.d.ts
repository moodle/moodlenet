import { Flow } from '../../../../lib/domain/types/path'
import { EmailObj } from '../types'

interface EmailPersistence {
  storeSentEmail(_: {
    email: EmailObj
    flow: Flow
    result: SendResult
  }): Promise<unknown>
}

export type SendResult =
  | { success: false; error: string }
  | { success: true; emailId: string }
