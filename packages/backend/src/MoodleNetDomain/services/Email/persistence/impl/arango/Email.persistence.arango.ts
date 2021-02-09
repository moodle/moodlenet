import { EmailPersistence } from '../../types'
import { storeSentEmail } from './apis/storeSentEmail'

export const arangoEmailPersistence: EmailPersistence = {
  storeSentEmail,
}
