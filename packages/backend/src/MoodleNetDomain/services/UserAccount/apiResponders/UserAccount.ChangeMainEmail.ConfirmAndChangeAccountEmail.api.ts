import { ConfirmAndChangeAccountEmailHandler } from '../apis/UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail').respond(
  ConfirmAndChangeAccountEmailHandler,
)
