import shell from './shell.mjs'

export const env = await getEnv()

type Env = {
  port: number
  domain: { name: string; protocol: string }
}
async function getEnv(): Promise<Env> {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = config
  return env
}
