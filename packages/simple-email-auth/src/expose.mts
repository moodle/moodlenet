import { setCurrentClientSessionToken } from '@moodlenet/authentication-manager'
import { login, signup } from './lib.mjs'
import shell from './shell.mjs'
import { SignupReq } from './types.mjs'

export const expose = await shell.expose({
  rpc: {
    login: {
      guard: () => void 0,
      fn: async ({ email, password }: { email: string; password: string }) => {
        const maybeSessionToken = await login({ email, password })
        if (!maybeSessionToken) {
          return { success: false } as const
        }
        const sessionToken = maybeSessionToken
        setCurrentClientSessionToken(sessionToken)

        return { success: true } as const
      },
    },
    signup: {
      guard: () => void 0,
      fn: (signupReq: SignupReq) => {
        return signup(signupReq)
      },
    },
  },
})
