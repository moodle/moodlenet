import { AccountRequest } from '../Accounting'

type AccountKey = string
export interface AccountingPersistence {
  addNewAccountRequest(_: { req: AccountRequest }): Promise<AccountKey>
}
