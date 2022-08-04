import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { getNodemailerSendEmailAdapter, SendResp } from './emailSender/nodemailer/nodemailer'

/* const stmpServer = sibTransport({
  apiKey: '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',
}) */

const configLocal = {
  service: 'SendinBlue', // no need to set host or port etc.
  auth: {
    user: 'shukeenkel@gmail.com',
    pass: 'MTF0wXL7mrOVA4sQ',
  },
}

/*
const configLocal = {
   service: 'SendinBlue', // no need to set host or port etc.
   auth: {
       user: 'yourRegisteredEmailOnSendinblue@email.com',
       pass: 'xxxxx!'
   }
}
*/

export type EmailService = ExtDef<
  '@moodlenet/email-service',
  '0.1.0',
  {
    send: SubTopo<{ paramIn1: string }, SendResp>
  },
  void,
  void
>

const ext: Ext<EmailService, [CoreExt, ReactAppExt]> = {
  name: '@moodlenet/email-service',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0'],
  wireup(shell) {
    // come lo passo nel codice ?
    const mailer = getNodemailerSendEmailAdapter(configLocal)
    // business logic, wire-up to the message system,
    // other packages integration
    //   listen to messages -> send other messages
    //    use other packages plugins (e.g add UI to react app, or add http-endpoint)

    // come lo passo
    // const mailer )getNodemailerSendEmailAdapter({smtp:'smtp:moodlenet.com'})
    shell.plugin<ReactAppExt>('@moodlenet/react-app@0.1.0', inst => {
      console.log(`moodlenet-email-service: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
        routes: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
          // rootPath: 'email-service', // http://localhost:3000/my-test
        },
      })
    })
    shell.expose({
      // http://localhost:8080/_/_/raw-sub/moodlenet-email-service/0.1.10/_test  body:{"paramIn2": "33"}
      'send/sub': {
        validate(/* data */) {
          return { valid: true }
        },
      },
    })
    return {
      // code that allocate system resouces ( DB connections, listen to ports )
      // implement package's service messages
      deploy() {
        shell.provide.services({
          async send(_) {
            const msg = {
              from: 'shukeenkel@gmail.com',
              to: 'ettorebevilacqua@gmail.com',
              subject: 'subject text ',
              html: '<h3>Hy test</h3>',
            }
            const resp = await mailer(msg)
            return resp
          },
        })
        return {}
      },
    }
  },
}

export default ext
