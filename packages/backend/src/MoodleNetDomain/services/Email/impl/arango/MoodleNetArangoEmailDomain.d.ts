import { Event } from '../../../../../lib/domain/event'
import { SubDef } from '../../../../../lib/domain/sub'
import { SubDomain } from '../../../../../lib/domain/types'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { SendResult } from '../../EmailDomain'
import { EmailObj } from '../../types'

export type MoodleNetArangoEmailDomain = SubDomain<
  MoodleNetDomain,
  'Email',
  {
    StoreSentEmail: SubDef<MoodleNetArangoEmailDomain, 'Email.EmailSent'>
    EmailSent: Event<{ result: SendResult; emailObj: EmailObj }>
  }
>
