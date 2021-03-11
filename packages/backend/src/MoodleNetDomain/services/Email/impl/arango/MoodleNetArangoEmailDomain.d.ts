import { Event } from '../../../../../lib/domain/event'
import { SubDomain } from '../../../../../lib/domain/impl'
import { Sub } from '../../../../../lib/domain/sub'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { SendResult } from '../../EmailDomain'
import { EmailObj } from '../../types'

export type MoodleNetArangoEmailDomain = SubDomain<
  MoodleNetDomain,
  'Email',
  {
    StoreSentEmail: Sub<MoodleNetArangoEmailDomain, 'Email.EmailSent'>
    EmailSent: Event<{ result: SendResult; emailObj: EmailObj }>
  }
>
