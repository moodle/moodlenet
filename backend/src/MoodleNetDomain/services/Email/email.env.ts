import { resolve } from 'path'
import * as Yup from 'yup'
import { EmailPersistence } from './persistence/types'
import { EmailSender } from './sender/types'

const SENDER_IMPL_MODULE = process.env.EMAIL_SENDER_IMPL_MODULE // EmailSenderModule implementatin module (without .js) relative from services/email/impl
const PERSISTENCE_IMPL_MODULE = process.env.EMAIL_PERSISTENCE_IMPL_MODULE // EmailPersistenceModule implementatin module (without .js) relative from services/email/impl

interface EmailEnv {
  persistenceModule: string
  senderModule: string
}

const Validator = Yup.object<EmailEnv>({
  persistenceModule: Yup.string().required().default('mongo'),
  senderModule: Yup.string().required().default('mailgun'),
})

const env = Validator.validateSync({
  persistenceModule: PERSISTENCE_IMPL_MODULE,
  senderModule: SENDER_IMPL_MODULE,
})!

const senderModulePathBase = [__dirname, 'sender', 'impl']
export const getSender = (): Promise<EmailSender> =>
  require(resolve(...senderModulePathBase, env.senderModule))

const persistenceModulePathBase = [__dirname, 'persistence', 'impl']
export const getEmailPersistence = (): Promise<EmailPersistence> =>
  require(resolve(...persistenceModulePathBase, env.persistenceModule))
