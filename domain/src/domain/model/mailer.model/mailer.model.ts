/* eslint-disable @typescript-eslint/no-namespace */
import { email_address } from '@moodle/lib-types'
import { configs } from './types'
declare global {
  namespace moo {
    interface Models {
      mailer: mailer
    }
  }
}
export type mailer = moo.model<MailerModel>

type modelUcTypes = moo.ucModelUcTypes<'mailer'>

export type MailerModel = {
  configs: configs
  sendUseCase: {
    [persona in keyof modelUcTypes]: {
      [ctx in keyof modelUcTypes[persona]]: {
        [scope in keyof modelUcTypes[persona][ctx]]: {
          [uc in keyof modelUcTypes[persona][ctx][scope]]: {
            [eml in keyof modelUcTypes[persona][ctx][scope][uc]]: moo.model.type.endpoint<
              ['async', { envelope: envelope; data: modelUcTypes[persona][ctx][scope][uc][eml] }, unknown]
            >
          }
        }
      }
    }
  }
}

export type envelope = {
  to: email_address[]
}
