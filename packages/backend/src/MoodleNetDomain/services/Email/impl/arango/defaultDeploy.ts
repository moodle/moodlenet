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
    event: 'Email.EmailSent',
  },
}

export const defaultArangoEmailStartServices = ({
  dbCfg,
  sender,
  databaseName,
}: {
  dbCfg: Config
  sender: EmailSender
  databaseName: string
}) => {
  const moodleNetArangoEmailDomainStart: DomainStart<MoodleNetArangoEmailDomain> = {
    'Email.SendOne': {
      init: async () => [SendOneWorker({ sender })],
    },
    'Email.StoreSentEmail': {
      init: async () => {
        const [persistence, teardown] = await getPersistence({ cfg: dbCfg, databaseName })
        //  const s:SubscriberInit<MoodleNetArangoEmailDomain,'Email.EmailSent'>=[StoreSentEmailSubscriber({ persistence }), teardown]
        return [StoreSentEmailSubscriber({ persistence }), teardown]
      },
    },
  }
  return moodleNetArangoEmailDomainStart
}
