export type AuthId = string
export const isAuthId = (_: any): _ is AuthId => 'string' === typeof _

export type SessionEnv = {
  user: {
    authId: AuthId
  }
}
