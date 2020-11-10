import { resolve } from 'path'
import * as Yup from 'yup'
import { AccountingPersistenceImpl } from './types'

const PERSISTENCE_IMPL_MODULE = process.env.ACCOUNTING_PERSISTENCE_IMPL_MODULE // AccountingPersistenceImpl implementatin module (without .js) relative from services/accounting/impl
const EMAIL_VERIFICATION_EXPIRE_DAYS = process.env.ACCOUNTING_EMAIL_VERIFICATION_EXPIRE_DAYS
const EMAIL_VERIFICATION_ATTEMPTS = process.env.ACCOUNTING_EMAIL_VERIFICATION_ATTEMPTS

interface AccountingEnv {
  persistenceImpl: string
  emailVerificationExpiresDays: number
  emailVerificationAttempts: number
}

const Validator = Yup.object<AccountingEnv>({
  persistenceImpl: Yup.string().required().default('mongo'),
  emailVerificationExpiresDays: Yup.number().required().default(7),
  emailVerificationAttempts: Yup.number().required().default(2),
})

export const env = Validator.validateSync({
  persistenceImpl: PERSISTENCE_IMPL_MODULE,
  emailVerificationExpiresDays: EMAIL_VERIFICATION_EXPIRE_DAYS,
  emailVerificationAttempts: EMAIL_VERIFICATION_ATTEMPTS,
})!

const implPathBase = [__dirname, 'impl']

export const persistence = require(resolve(
  ...implPathBase,
  'persistence',
  env.persistenceImpl
)) as AccountingPersistenceImpl
