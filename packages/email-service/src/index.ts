import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { getNodemailerSendEmailAdapter } from './emailSender/nodemailer/nodemailer'

// come lo passo nel codice ?
const mailer = getNodemailerSendEmailAdapter({ smtp: 'smtp:moodlenet.com' })

export type EmailService = ExtDef<
  'moodlenet-email-service',
  '0.1.10',
  {
    send: SubTopo<{ paramIn1: string }, { out1: string }>
  }
>

const ext: Ext<EmailService, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-email-service@0.1.10',
  displayName: 'test ext',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    // business logic, wire-up to the message system,
    // other packages integration
    //   listen to messages -> send other messages
    //    use other packages plugins (e.g add UI to react app, or add http-endpoint)

    // come lo passo
    // const mailer )getNodemailerSendEmailAdapter({smtp:'smtp:moodlenet.com'})
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`moodlenet-email-service: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
        routes: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
          rootPath: 'my-test', // http://localhost:3000/my-test
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
        shell.lib.pubAll<EmailService>('moodlenet-email-service@0.1.10', shell, {
          /* _test: ({
            msg: {
              data: {
                req: { paramIn2 },
              },
            },
          }) => { //returns ObservableInput<{ out2: number}> (from rxjs)
           // return [{ out2: Number(paramIn2) }]
           // return Promise.resolve({ out2: Number(paramIn2) })
           // return shell.lib.rx.of({ out2: Number(paramIn2) })
           return [{ out2: Number(paramIn2) }]
          }, */
          /*  async _test({
            msg: {
              data: {
                req: { paramIn2 },
              },
            },
          }) {
            // call DB or call another service
            // read fileasystem
            return { out2: Number(paramIn2) }
          }, */
          async send(_) {
            const resp = mailer({ from: 'me@me.it', to: 'to@to.it', body: '' })
            if (!resp) {
              console.log('emailSender error on send mail')
            }
            return resp.emailId
          },
        })
        return {}
      },
    }
  },
}

export default { exts: [ext] }
