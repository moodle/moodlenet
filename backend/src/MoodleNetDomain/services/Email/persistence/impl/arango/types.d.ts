import { Flow } from '../../../../../../lib/domain/types/path'
import { WithCreated, WithFlow } from '../../../../../../lib/helpers/types'
import { SendResult } from '../../../apis/Email.SendOne.Req'
import { EmailObj } from '../../../types'

// ^ SentEmailDocument
export type SentEmailDocument = WithFlow &
  WithCreated & {
    email: EmailObj
    result: SendResult
  }
// $ SentEmailDocument
