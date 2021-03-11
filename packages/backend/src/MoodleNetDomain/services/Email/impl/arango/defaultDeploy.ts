import { Config } from 'arangojs/connection'
import { DomainSetup, DomainStart } from '../../../../../lib/domain/types'
import { EmailSender } from '../../sendersImpl/types'
import { SendOneWorker } from './apis/sendOne'
import { StoreSentEmailSubscriber } from './apis/storeSentEmail'
import { MoodleNetArangoEmailDomain } from './MoodleNetArangoEmailDomain'
import { getPersistence } from './persistence'

export const defaultArangoEmailSetup: DomainSetup<MoodleNetArangoEmailDomain> = {
  'Email.SendOne': { kind: 'wrk' },
  'Email.StoreSentEmail': {
    kind: 'sub',
    events: ['Email.EmailSent'],
  },
}

export const defaultArangoEmailStartServices = ({ dbCfg, sender }: { dbCfg: Config; sender: EmailSender }) => {
  const moodleNetArangoEmailDomainStart: DomainStart<MoodleNetArangoEmailDomain> = {
    'Email.SendOne': {
      init: () => [SendOneWorker({ sender })],
    },
    'Email.StoreSentEmail': {
      init: async () => {
        const [persistence, teardown] = await getPersistence({ cfg: dbCfg })
        return [StoreSentEmailSubscriber({ persistence }), teardown]
      },
    },
  }
  return moodleNetArangoEmailDomainStart
}
