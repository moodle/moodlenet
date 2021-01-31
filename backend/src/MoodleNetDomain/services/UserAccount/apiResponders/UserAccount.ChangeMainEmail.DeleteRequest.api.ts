import { ChangeAccountEmailDeleteRequestApiHandler } from '../apis/UserAccount.ChangeMainEmail.DeleteRequest'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('UserAccount.ChangeMainEmail.DeleteRequest').respond(
  ChangeAccountEmailDeleteRequestApiHandler
)
