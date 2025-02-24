/* eslint-disable @typescript-eslint/no-namespace */
import { email_address } from '@moodle/lib-types'
import { mailerConfigs } from './types'
declare global {
  namespace moo {
    interface Models {
      mailer: mailer
    }
  }
}
export type mailer = moo.model<MailerModel>

type xTypes = moo.model.xTypes.blueprint<'mailer'>

export type MailerModel = {
  [moo.configs]: mailerConfigs
  send: {
    [xModel in keyof xTypes]: {
      [eml in keyof xTypes[xModel]]: moo.model.type.endpoint<['async', { envelope: envelope; data: xTypes[xModel][eml] }, unknown]>
    }
  }
}

export type envelope = {
  to: email_address[]
}
