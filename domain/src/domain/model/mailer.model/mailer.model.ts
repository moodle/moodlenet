/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { emailBody, emailEnvelope } from './types/email'
const MODEL_NAME = 'mailer'

type _t = moo.Models.mailer.Templates
declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: mailer
    }
    namespace Models {
      namespace mailer {
        interface Templates {}
      }
    }
  }
}
export type mailer = moo.def.model<MailerModel>

export type MailerModel = {
  template: moo.def.model.op<
    ['query', <ns extends keyof _t, type extends keyof _t[ns]>(_: { ns: ns; type: type; data: _t[ns][type] }) => Promise<{ body: emailBody; subject: string }>]
  >
  send: moo.def.model.op<['async', { envelope: emailEnvelope }, unknown]>
}
