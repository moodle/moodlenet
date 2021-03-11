import { StartServices } from '../../../../../lib/domain/amqp/start'
import { DomainImpl } from '../../../../../lib/domain/impl'
import { mailgunImpl } from '../../sendersImpl/mailgun/mailgunSender'
import { SendOneWrkInit } from './apis/sendOne'
import { StoreSentEmailSubInit } from './apis/storeSentEmail'
import { MoodleNetArangoEmailDomain } from './MoodleNetArangoEmailDomain'

export const defaulArangoMailgunImpl: DomainImpl<MoodleNetArangoEmailDomain> = {
  'Email.SendOne': {
    kind: 'wrk',
    init: SendOneWrkInit({ sender: mailgunImpl }),
  },
  'Email.StoreSentEmail': {
    kind: 'sub',
    events: ['Email.EmailSent'],
    init: StoreSentEmailSubInit,
  },
}

export const defaultArangoMailgunImplStartServices: StartServices<MoodleNetArangoEmailDomain> = {
  'Email.SendOne': {},
  'Email.StoreSentEmail': {},
}
