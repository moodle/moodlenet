import { shell } from '../shell.mjs'

export const env = await getEnv()
console.log('ENV:', env)

type Env = {
  newUserNotPublisher: boolean
}
function getEnv(): Env {
  const config: Env = {
    newUserNotPublisher: !!shell.config.newUserNotPublisher,
  }
  const env: Env = config
  return env
}
