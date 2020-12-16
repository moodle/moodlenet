import Argon from 'argon2'
import { SignOptions } from 'jsonwebtoken'
import { resolve } from 'path'
import sshpk from 'sshpk'
import * as Yup from 'yup'
import { once } from '../../../lib/helpers/misc'
import { AccountingPersistence } from './persistence/types'

const PERSISTENCE_IMPL = process.env.ACCOUNTING_PERSISTENCE_IMPL

export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!
sshpk.parseKey(JWT_PRIVATE_KEY!, 'pem')
export const jwtSignBaseOpts: SignOptions = { algorithm: 'RS256' }

export const getAccountPersistence = once(
  async (): Promise<AccountingPersistence> => {
    const persistenceModule = Yup.string()
      .required()
      .default('arango')
      .validateSync(PERSISTENCE_IMPL)
    return require(resolve(__dirname, 'persistence', 'impl', persistenceModule))
  }
)

export const ArgonPwdHashOpts: Parameters<typeof Argon.hash>[1] = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: Argon.argon2id,
}
