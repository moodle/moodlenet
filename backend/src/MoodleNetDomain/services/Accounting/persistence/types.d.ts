import { Flow } from '../../../../lib/domain/types/path'
import { CreatedDocumentBase, Maybe, MutableDocumentBase } from '../../../../lib/helpers/types'
import { AccountRequest } from '../Accounting'

type AccountKey = string
export interface AccountingPersistence {
  isUserNameAvailable(_: { username: string }): Promise<boolean>
  newAccountRequestExpired(_: { flow: Flow }): Promise<Maybe<NewAccountRequestDocument>>
  addNewAccountRequest(_: {
    req: AccountRequest
    flow: Flow
  }): Promise<true | 'account or request with this email already present'>
  confirmNewAccountRequest(_: {
    flow: Flow
  }): Promise<'Confirmed' | 'Request Not Found' | 'Previously Confirmed'>
  activateNewAccount(_: {
    requestFlowKey: string
    password: string
    username: string
  }): Promise<
    AccountDocument | 'Request Not Found' | 'Unconfirmed Request' | 'Username Not Available'
  >
  config(): Promise<Config>
}

// ^ AccountDocument
type AccountDocument = {
  email: string
  password: string
  username: string
  active: boolean
  requestFlowKey: string
} & MutableDocumentBase
// $ AccountDocument

// ^ NewAccountRequestDocument
type NewAccountRequestDocumentStatus =
  | 'Waiting Email Confirmation'
  | 'Email Confirmed'
  | 'Confirm Expired'
type NewAccountRequestDocument = {
  email: string
  status: NewAccountRequestDocumentStatus
} & Flow &
  MutableDocumentBase
// $ NewAccountRequestDocument

// ^ Config
type Config = {
  sendEmailConfirmationAttempts: number
  sendEmailConfirmationDelay: number
  newAccountRequestEmail: {
    text: string
    subject: string
    from: string
  }
} & CreatedDocumentBase
// $ Config
