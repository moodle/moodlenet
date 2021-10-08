export type AuthId = string
export const isAuthId = (_: any): _ is AuthId => 'string' === typeof _

export type SessionEnv = {
  user: {
    authId: AuthId
  }
}

export const isSessionEnv = (_: any): _ is SessionEnv => {
  // console.log(`isSessionEnv `, _, typeof _?.user?.authId === 'string')
  return typeof _?.user?.authId === 'string'
}
