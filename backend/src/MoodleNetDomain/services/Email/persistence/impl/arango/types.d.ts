import { Flow } from '../../../../../../lib/domain/types/path'
import { EmailObj } from '../../../types'
import { SendResult } from '../../types'

// ^ SentEmailDocument
export type SentEmailDocument = {
  email: EmailObj
  flow: Flow
  attempts: { result: SendResult; datetime: Date }[]
}
// $ SentEmailDocument
