import { ConfirmEmailActivateAccountApiHandler } from '../apis/UserAccount.RegisterNewAccount.ActivateNewAccount'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount').respond(
  ConfirmEmailActivateAccountApiHandler,
)
