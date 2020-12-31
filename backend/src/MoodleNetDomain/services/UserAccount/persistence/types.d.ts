import { Flow } from '../../../../lib/domain/types/path'
import {
  CreatedDocumentBase,
  Maybe,
  MutableDocumentBase,
} from '../../../../lib/helpers/types'
import { EmailObj } from '../../Email/types'
import { AccountRequest, ChangeAccountEmailRequest } from '../UserAccount'
import { ChangeAccountEmailRequestEmailVars } from '../assets/defaultConfig/changeAccountEmailRequestEmail'
import { NewAccountRequestEmailVars } from '../assets/defaultConfig/newAccountRequestEmail'
import { TempSessionEmailVars } from '../assets/defaultConfig/tempSessionEmail'

type AccountKey = string
export interface UserAccountPersistence {
  getAccountByUsername(_: { username: string }): Promise<Maybe<AccountDocument>>
  isUserNameAvailable(_: { username: string }): Promise<boolean>
  newAccountRequestExpired(_: {
    flow: Flow
  }): Promise<Maybe<NewAccountRequestDocument>>
  addNewAccountRequest(_: {
    req: AccountRequest
    flow: Flow
  }): Promise<true | 'account or request with this email already present'>
  changePassword(_: {
    username: string
    newPassword: string
  }): Promise<true | 'not found'>
  addChangeAccountEmailRequest(_: {
    req: ChangeAccountEmailRequest
    flow: Flow
  }): Promise<true | 'account or request with this email already present'>
  confirmAccountEmailChangeRequest(_: {
    flow: Flow
  }): Promise<'Confirmed' | 'Request Not Found' | 'Previously Confirmed'>
  changeAccountEmailRequestExpired(_: {
    flow: Flow
  }): Promise<Maybe<ChangeAccountEmailRequestDocument>>
  confirmNewAccountRequest(_: {
    flow: Flow
  }): Promise<'Confirmed' | 'Request Not Found' | 'Previously Confirmed'>
  activateNewAccount(_: {
    requestFlowKey: string
    password: string
    username: string
  }): Promise<
    | AccountDocument
    | 'Request Not Found'
    | 'Unconfirmed Request'
    | 'Username Not Available'
    | 'Account Already Created'
  >
  config(): Promise<Config>
}

// ^ AccountDocument
type AccountDocument = {
  email: string
  password: string
  username: string
  active: boolean
  requestFlowKey: string // TODO: remove this. may use some incoming edge instead
} & MutableDocumentBase
// $ AccountDocument

// ^ NewAccountRequestDocument
type NewAccountRequestDocumentStatus =
  | 'Waiting Email Confirmation'
  | 'Email Confirmed'
  | 'Account Created'
  | 'Confirm Expired'
type NewAccountRequestDocument = {
  email: string
  status: NewAccountRequestDocumentStatus
} & Flow & // TODO: would it make sense to use incoming edge for flow relation too (all around ) ?
  MutableDocumentBase
// $ NewAccountRequestDocument

// ^ ChangeAccountEmailRequestDocument
type ChangeAccountEmailRequestDocumentStatus =
  | 'Waiting Email Confirmation'
  | 'Email Confirmed'
  | 'Confirm Expired'
type ChangeAccountEmailRequestDocument = {
  newEmail: string
  username: string
  status: ChangeAccountEmailRequestDocumentStatus
} & Flow &
  MutableDocumentBase
// $ ChangeAccountEmailRequestDocument

// ^ Config
type Config = {
  sendEmailConfirmationAttempts: number
  sendEmailConfirmationDelaySecs: number
  newAccountRequestEmail: EmailTemplate<NewAccountRequestEmailVars>
  changeAccountEmailRequestEmail: EmailTemplate<ChangeAccountEmailRequestEmailVars>
  tempSessionEmail: EmailTemplate<TempSessionEmailVars>
  resetPasswordSessionValiditySecs: number
  sessionValiditySecs: number
} & CreatedDocumentBase
// $ Config

type EmailTemplate<Vars> = Pick<
  EmailObj,
  'from' | 'subject' | 'html' | 'text'
> & { __?: Vars }
