import { resolve } from 'path'
import Yup from 'yup'
import { EmailSenderImpl, EmailPersistenceImpl } from './types'

const SENDER_IMPL_MODULE = process.env.EMAIL_SENDER_IMPL_MODULE // EmailSenderImpl implementatin module (without .js) relative from services/email/impl
const PERSISTENCE_IMPL_MODULE = process.env.EMAIL_PERSISTENCE_IMPL_MODULE // EmailPersistenceImpl implementatin module (without .js) relative from services/email/impl

interface EmailEnv {
  persistenceImpl: string
  senderImpl: string
}

const Validator = Yup.object<EmailEnv>({
  persistenceImpl: Yup.string().required(),
  senderImpl: Yup.string().required(),
})

const env = Validator.validateSync({
  persistenceImpl: PERSISTENCE_IMPL_MODULE,
  senderImpl: SENDER_IMPL_MODULE,
})!

const implPathBase = [__dirname, 'impl']

export const sender = require(resolve(
  ...implPathBase,
  'sender',
  env.persistenceImpl
)) as EmailSenderImpl

export const persistence = require(resolve(
  ...implPathBase,
  'persistence',
  env.persistenceImpl
)) as EmailPersistenceImpl
