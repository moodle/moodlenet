import { AccountRequest } from '../Accounting'

type AccountKey = string
export interface AccountingPersistence {
  removeNewAccountRequest(_: { key: string }): Promise<AccountDocument | undefined>
  addNewAccountRequest(_: { request: AccountRequest }): Promise<AccountKey>
  activateNewAccount(_: { key: string }): Promise<AccountDocument | undefined>
}

type AccountDocument = {
  username: string
  email: string
  activeFrom: Date | null
  requestAt: Date
}
