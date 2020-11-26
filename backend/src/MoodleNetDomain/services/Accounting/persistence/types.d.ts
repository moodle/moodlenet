import { Flow } from '../../../../lib/domain/types/path'
import { AccountRequest } from '../Accounting'

type AccountKey = string
export interface AccountingPersistence {
  removeNewAccountRequest(_: { flow: Flow }): Promise<AccountDocument | undefined>
  addNewAccountRequest(_: { req: AccountRequest; flow: Flow }): Promise<void>
  activateNewAccount(_: { flow: Flow }): Promise<AccountDocument | undefined>
}

type AccountDocument = {
  username: string
  email: string
  activeFrom: Date | null
  requestAt: Date
} & Flow
