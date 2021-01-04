import { Flow } from '../../../../../../lib/domain/types/path'
import { WithCreated, WithFlow } from '../../../../../../lib/helpers/types'
import { EmailObj } from '../../../types'
import { SendResult } from '../../types'

// ^ SentEmailDocument
export type SentEmailDocument = WithFlow &
  WithCreated & {
    email: EmailObj
    result: SendResult
  }
// $ SentEmailDocument
