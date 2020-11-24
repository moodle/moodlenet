import { resolve } from 'path'
import * as Yup from 'yup'
// import { logger } from '../../../lib/domain/domain.env'
import { AccountingPersistence } from './persistence/types'

interface QueueEnv {
  persistenceModule: string
}

const Validator = Yup.object<QueueEnv>({
  persistenceModule: Yup.string().required().default('arango'),
})

const PERSISTENCE_IMPL = process.env.ACCOUNTING_PERSISTENCE_IMPL

export const env = Validator.validateSync({
  persistenceModule: PERSISTENCE_IMPL,
})!

const persistenceImplPathBase = [__dirname, 'persistence', 'impl']
export const accountPersistence = require(resolve(
  ...persistenceImplPathBase,
  env.persistenceModule
)) as AccountingPersistence
export const accountingLogger = console.log //logger('email')
