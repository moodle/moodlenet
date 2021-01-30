import { MoodleNet } from '../../..'
import { ChangeAccountEmailRequestHandler } from '../apis/UserAccount.ChangeMainEmail.Request.'

MoodleNet.api('UserAccount.ChangeMainEmail.Request').respond(
  ChangeAccountEmailRequestHandler
)
