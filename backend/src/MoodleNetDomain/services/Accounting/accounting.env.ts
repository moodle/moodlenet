import { resolve } from 'path'
import * as Yup from 'yup'
import { once } from '../../../lib/helpers/misc'
import { AccountingPersistence } from './persistence/types'

const PERSISTENCE_IMPL = process.env.ACCOUNTING_PERSISTENCE_IMPL

export const getAccountPersistence = once(
  async (): Promise<AccountingPersistence> => {
    const persistenceModule = Yup.string()
      .required()
      .default('arango')
      .validateSync(PERSISTENCE_IMPL)
    return require(resolve(__dirname, 'persistence', 'impl', persistenceModule))
  }
)
