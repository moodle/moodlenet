import { ChangeAccountEmailRequestHandler } from '../apis/UserAccount.ChangeMainEmail.Request.'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('UserAccount.ChangeMainEmail.Request').respond(ChangeAccountEmailRequestHandler)
