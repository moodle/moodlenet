export const env = getEnv({})
function getEnv(_: any): Env {
  const rootPassword = typeof _?.rootPassword === 'string' ? String(_.rootPassword) : undefined
  return {
    rootPassword,
  }
}
export type Env = { rootPassword?: string }
