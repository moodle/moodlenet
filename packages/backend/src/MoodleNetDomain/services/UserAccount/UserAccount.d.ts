import { GraphQLApi } from '../../MoodleNetGraphQL'
import {
  AccountEmailChangedEvent,
  ConfirmAndChangeAccountEmailHandler,
} from './apis/UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'
import { ChangeAccountEmailDeleteRequestApiHandler } from './apis/UserAccount.ChangeMainEmail.DeleteRequest'
import { ChangeAccountEmailRequestHandler } from './apis/UserAccount.ChangeMainEmail.Request.'
import { ChangePasswordApiHandler } from './apis/UserAccount.ChangePassword'
import {
  ConfirmEmailActivateAccountApiHandler,
  NewAccountActivatedEvent,
} from './apis/UserAccount.RegisterNewAccount.ActivateNewAccount'
import { RegisterNewAccountDeleteRequestApiHandler } from './apis/UserAccount.RegisterNewAccount.DeleteRequest'
import { RegisterNewAccountRequestApiHandler } from './apis/UserAccount.RegisterNewAccount.Request'
import { SessionByEmailApiHandler } from './apis/UserAccount.Session.ByEmail'
import { SessionCreateApiHandler } from './apis/UserAccount.Session.Create'
import { SessionGetApiHandler } from './apis/UserAccount.Session.Get'

export type UserAccount = {
  RegisterNewAccount: {
    Request: typeof RegisterNewAccountRequestApiHandler
    DeleteRequest: typeof RegisterNewAccountDeleteRequestApiHandler
    ConfirmEmailActivateAccount: typeof ConfirmEmailActivateAccountApiHandler
    NewAccountActivated: NewAccountActivatedEvent
  }

  ChangeMainEmail: {
    Request: typeof ChangeAccountEmailRequestHandler
    ConfirmAndChangeAccountEmail: typeof ConfirmAndChangeAccountEmailHandler
    DeleteRequest: typeof ChangeAccountEmailDeleteRequestApiHandler
    AccountEmailChanged: AccountEmailChangedEvent
  }

  ChangePassword: typeof ChangePasswordApiHandler

  Session: {
    ByEmail: typeof SessionByEmailApiHandler
    Create: typeof SessionCreateApiHandler
    Get: typeof SessionGetApiHandler
  }

  GQL: GraphQLApi
}
