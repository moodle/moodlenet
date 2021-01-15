import { Api } from '../../../lib/domain/api/types'
import { Event } from '../../../lib/domain/event/types'
import { GraphQLApi } from '../../MoodleNetGraphQL'
import {
  AccountEmailChangedEvent,
  ConfirmAndChangeAccountEmailApi,
} from './apis/UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'
import { ChangeAccountEmailDeleteRequestApi } from './apis/UserAccount.ChangeMainEmail.DeleteRequest'
import { ChangeAccountEmailRequestApi } from './apis/UserAccount.ChangeMainEmail.Request.'
import { ChangePasswordApi } from './apis/UserAccount.ChangePassword'
import {
  ConfirmEmailActivateAccountApi,
  NewAccountActivatedEvent,
} from './apis/UserAccount.RegisterNewAccount.ActivateNewAccount'
import { RegisterNewAccountDeleteRequestApi } from './apis/UserAccount.RegisterNewAccount.DeleteRequest'
import { RegisterNewAccountRequestApi } from './apis/UserAccount.RegisterNewAccount.Request'
import { SessionByEmailApi } from './apis/UserAccount.Session.ByEmail'
import { SessionCreateApi } from './apis/UserAccount.Session.Create'
import { ActiveUserAccount } from './persistence/types'

export type UserAccount = {
  RegisterNewAccount: {
    Request: RegisterNewAccountRequestApi
    DeleteRequest: RegisterNewAccountDeleteRequestApi
    ConfirmEmailActivateAccount: ConfirmEmailActivateAccountApi
    NewAccountActivated: NewAccountActivatedEvent
  }

  ChangeMainEmail: {
    Request: ChangeAccountEmailRequestApi
    ConfirmAndChangeAccountEmail: ConfirmAndChangeAccountEmailApi
    DeleteRequest: ChangeAccountEmailDeleteRequestApi
    AccountEmailChanged: AccountEmailChangedEvent
  }

  ChangePassword: ChangePasswordApi

  Session: {
    ByEmail: SessionByEmailApi
    Create: SessionCreateApi
  }

  GQL: GraphQLApi
}

export type MaybeSessionAuth = {
  auth: { jwt: string; userAccount: ActiveUserAccount } | null
}
