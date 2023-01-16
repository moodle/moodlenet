import shell from './shell.mjs'
import { NodemailerTransport } from './types.mjs'

export const env = await getEnv()

type Env = {
  nodemailerTransport: NodemailerTransport
}
async function getEnv(): Promise<Env> {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = config
  return env
}
