import { resolve } from 'path'
import * as Yup from 'yup'
import { once } from '../../../lib/helpers/misc'
import { AccountingPersistence } from './persistence/types'
import Argon from 'argon2'

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

const argonOpts: (Argon.Options & { raw?: false }) | { raw: true } = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: Argon.argon2id,
}
export const hashPassword = (_: { pwd: string }) => {
  const { pwd } = _
  const hashedPassword = Argon.hash(pwd, argonOpts)
  return hashedPassword
}
export const verifyPassword = (_: { hash: string; pwd: string | Buffer }) => {
  const { pwd, hash } = _
  const hashedPassword = Argon.verify(hash, pwd, argonOpts)
  return hashedPassword
}
