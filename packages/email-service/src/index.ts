import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { send, SendResp } from './emailSender/nodemailer/nodemailer'
import { EmailObj } from './types'

export * from './types'

export type EmailService = ExtDef<
  '@moodlenet/email-service',
  '0.1.0',
  void,
  {
    send: SubTopo<{ emailObj: EmailObj }, SendResp>
  }
>

const ext: Ext<EmailService, [CoreExt, ReactAppExt]> = {
  name: '@moodlenet/email-service',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0'],
  connect(shell) {
    const [, reactApp] = shell.deps
    // const env = getEnv(shell.env)
    return {
      deploy() {
        reactApp.plug.setup({
          routes: {
            moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
            // rootPath: 'email-service', // http://localhost:3000/my-test
          },
        })

        shell.expose({
          'send/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
        })

        shell.provide.services({
          async send({ emailObj }) {
            const resp = await send(defaultFrom(emailObj), { jsonTransport: true })
            return resp
          },
        })
        return {}
      },
    }
    function defaultFrom(emailObj: EmailObj): EmailObj {
      return {
        from: undefined, //mailerCfg.defaultFrom,
        ...emailObj,
      }
    }
  },
}

export default ext

// type Env = {
//   mailerCfg: MailerCfg
//   defaultFrom?: string
// }
// function getEnv(_: any): Env {
//   // mailerCfg:{jsonTransport}
//   return {
//     mailerCfg: _?.mailerCfg,
//     defaultFrom: _?.defaultFrom,
//   }
// }
