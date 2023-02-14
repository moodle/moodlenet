import shell from './shell.mjs'

export const env = await getEnv()

type Env = {
  port: number
  protocol: string
}
async function getEnv(): Promise<Env> {
  const config: Env = {
    port: shell.config.port,
    protocol: shell.config.protocol,
  }
  //FIXME: validate configs
  const env: Env = config
  return env
}
