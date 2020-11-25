import { FlowId } from '../../../../lib/domain/types/path'
import { AccountRequest } from '../Accounting'

type AccountKey = string
export interface AccountingPersistence {
  removeNewAccountRequest(_: { flowId: FlowId }): Promise<AccountDocument | undefined>
  addNewAccountRequest(_: { req: AccountRequest; flowId: FlowId }): Promise<void>
  activateNewAccount(_: { flowId: FlowId }): Promise<AccountDocument | undefined>
}

type AccountDocument = {
  username: string
  email: string
  activeFrom: Date | null
  requestAt: Date
} & FlowId
