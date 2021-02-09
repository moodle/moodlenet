import { resolve } from 'path'
import * as Yup from 'yup'
import { once } from '../../../lib/helpers/misc'
import { EmailPersistence } from './persistence/types'
import { EmailSender } from './sender/types'

const SENDER_IMPL_MODULE = process.env.EMAIL_SENDER_IMPL_MODULE // EmailSenderModule implementatin module (without .js) relative from services/email/impl
const PERSISTENCE_IMPL_MODULE = process.env.EMAIL_PERSISTENCE_IMPL_MODULE // EmailPersistenceModule implementatin module (without .js) relative from services/email/impl

export const getSender = once(
  async (): Promise<EmailSender> => {
    const senderModule = Yup.string().required().default('mailgun').validateSync(SENDER_IMPL_MODULE)
    return require(resolve(__dirname, 'sender', 'impl', senderModule))
  },
)

export const getEmailPersistence = once(
  async (): Promise<EmailPersistence> => {
    const persistenceModule = Yup.string().required().default('arango').validateSync(PERSISTENCE_IMPL_MODULE)
    return require(resolve(__dirname, 'persistence', 'impl', persistenceModule))
  },
)
