import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import { KeyValueStoreExtDef } from '@moodlenet/key-value-store'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { MailerCfg, send, SendResp } from './emailSender/nodemailer/nodemailer'
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

const ext: Ext<EmailService, [CoreExt, ReactAppExt, KeyValueStoreExtDef, ReactAppExt]> = {
  name: '@moodlenet/email-service',
  version: '0.1.0',
  requires: [
    '@moodlenet/core@0.1.0',
    '@moodlenet/react-app@0.1.0',
    '@moodlenet/key-value-store@0.1.0',
    '@moodlenet/react-app@0.1.0',
  ],
  async connect(shell) {
    const [, reactApp, kvStore] = shell.deps
    const kvstore = await kvStore.plug.getStore<{ mailerCfg: MailerCfg }>()

    const env = getEnv(shell.env)
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
            const mailerCfg = env?.mailerCfg ?? (await kvstore.get('mailerCfg', '')).value
            console.log({ mailerCfg })
            if (!mailerCfg) {
              throw new Error(`no mailerCfg defined in env or kvstore ! can't send email !`)
            }
            const resp = await send(mailerCfg.transport, {
              from: mailerCfg.defaultFrom,
              replyTo: mailerCfg.defaultFrom,
              ...emailObj,
            })
            return resp
          },
        })
        return {}
      },
    }
  },
}

export default ext

type Env =
  | Partial<{
      mailerCfg: MailerCfg
    }>
  | undefined
function getEnv(_: any): Env {
  // mailerCfg:{jsonTransport}
  return _
    ? {
        mailerCfg: _.mailerCfg,
      }
    : undefined
}
