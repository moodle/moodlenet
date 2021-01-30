import { MoodleNet } from '../../..'
import { ChangeAccountEmailDeleteRequestApiHandler } from '../apis/UserAccount.ChangeMainEmail.DeleteRequest'

MoodleNet.api('UserAccount.ChangeMainEmail.DeleteRequest').respond(
  ChangeAccountEmailDeleteRequestApiHandler
)
