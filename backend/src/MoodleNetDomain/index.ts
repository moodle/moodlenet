import { domain, DomainApiResponderOpts } from '../lib/domain'
import { MoodleNetDomain } from './MoodleNetDomain'

const apiRespondersOpts: DomainApiResponderOpts<MoodleNetDomain> = {
  'Accounting.Register_New_Account.ActivateNewAccount': {
    consume: {},
    queue: {},
  },
}

export const MoodleNet = domain<MoodleNetDomain>({
  name: 'MoodleNet',
  apiRespondersOpts,
})
