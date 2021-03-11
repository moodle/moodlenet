import { WithCreated, WithFlow } from '../../../../../lib/helpers/types'
import { SendResult } from '../../EmailDomain'
import { EmailObj } from '../../types'

// ^ SentEmailDocument
export type SentEmailDocument = WithFlow &
  WithCreated & {
    email: EmailObj
    result: SendResult
  }
// $ SentEmailDocument
