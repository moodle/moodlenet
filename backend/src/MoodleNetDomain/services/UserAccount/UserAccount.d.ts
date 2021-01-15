import { Api } from '../../../lib/domain/api/types'
import { Event } from '../../../lib/domain/event/types'
import { GraphQLApi } from '../../MoodleNetGraphQL'
import {
  Account_Email_Changed_Event,
  Confirm_And_Change_Account_Email_Api,
} from './apis/UserAccount.Change_Main_Email.Confirm_And_Change_Account_Email'
import { Change_Account_Email_Delete_Request_Api } from './apis/UserAccount.Change_Main_Email.Delete_Request'
import { Change_Account_Email_Request_Api } from './apis/UserAccount.Change_Main_Email.Request.'
import { Change_Password_Api } from './apis/UserAccount.Change_Password'
import {
  Confirm_Email_Activate_Account_Api,
  NewAccountActivatedEvent,
} from './apis/UserAccount.Register_New_Account.Activate_New_Account'
import { Register_New_Account_Delete_Request_Api } from './apis/UserAccount.Register_New_Account.Delete_Request'
import { Register_New_Account_Request_Api } from './apis/UserAccount.Register_New_Account.Request'
import { Session_By_Email_Api } from './apis/UserAccount.Session.By_Email'
import { Session_Create_Api } from './apis/UserAccount.Session.Create'
import { ActiveUserAccount } from './persistence/types'

export type UserAccount = {
  Register_New_Account: {
    Request: Register_New_Account_Request_Api
    Delete_Request: Register_New_Account_Delete_Request_Api
    Confirm_Email_Activate_Account: Confirm_Email_Activate_Account_Api
    New_Account_Activated: NewAccountActivatedEvent
  }

  Change_Main_Email: {
    Request: Change_Account_Email_Request_Api
    Confirm_And_Change_Account_Email: Confirm_And_Change_Account_Email_Api
    Delete_Request: Change_Account_Email_Delete_Request_Api
    Account_Email_Changed: Account_Email_Changed_Event
  }

  Change_Password: Change_Password_Api

  Session: {
    By_Email: Session_By_Email_Api
    Create: Session_Create_Api
  }

  GQL: GraphQLApi
}

export type MaybeSessionAuth = {
  auth: { jwt: string; userAccount: ActiveUserAccount } | null
}
