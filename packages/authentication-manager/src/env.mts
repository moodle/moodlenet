import shell from './shell.mjs'

export const env = getEnv(shell.config)
function getEnv(_: any): Env {
  const rootPassword = 'string' === typeof _?.rootPassword ? _.rootPassword : undefined
  return {
    rootPassword,
  }
}
export type Env = { rootPassword?: string }
