import getStore from '@moodlenet/key-value-store/server'
import { shell } from './shell.mjs'
import type { MailerCfg, NodemailerTransport } from './types.mjs'

export const env = getEnv()

export type KVSTypes = { mailerCfg: MailerCfg }

export const kvStore = await getStore<KVSTypes>(shell)

if (!(await kvStore.get('mailerCfg', '')).value) {
  kvStore.set('mailerCfg', '', {
    defaultFrom: 'noreply',
    defaultReplyTo: 'noreply',
  })
}

type Env = {
  nodemailerTransport: NodemailerTransport
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = config
  return env
}
