/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { mailerConfigs } from './types'
import { emailBody, emailEnvelope } from './types/email'
declare global {
  namespace moo {
    interface Models {
      mailer: mailer
    }
    namespace Models {
      namespace mailer {
        interface Templates {}
      }
    }
  }
}
export type mailer = moo.model<MailerModel>

export type MailerModel = {
  [moo.tags.configs]: mailerConfigs
  template: {
    [namespace in keyof moo.Models.mailer.Templates]: {
      [tplParams in keyof moo.Models.mailer.Templates[namespace]]: moo.model.op<
        ['query', { data: moo.Models.mailer.Templates[namespace][tplParams] }, { body: emailBody; subject: string }]
      >
    }
  }
  send: moo.model.op<['async', { envelope: emailEnvelope }, unknown]>
}
