import { Database } from 'arangojs'
import { DocumentCollection } from 'arangojs/collection'
import { WithCreated, WithFlow } from '../../../../../lib/helpers/types'
import { SendResult } from '../../EmailDomain'
import { EmailSender } from '../../sendersImpl/types'
import { EmailObj } from '../../types'

// ^ SentEmailDocument
export type SentEmailDocument = WithFlow &
  WithCreated & {
    email: EmailObj
    result: SendResult
  }
// $ SentEmailDocument

export type Persistence = {
  db: Database
  SentEmailCollection: DocumentCollection<SentEmailDocument>
}

export type InitCtx = {
  sender: EmailSender
  arango: Persistence
}
