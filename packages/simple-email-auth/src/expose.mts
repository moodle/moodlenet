import { confirm, login, signup } from './lib.mjs'
import shell from './shell.mjs'
import { SignupReq } from './types.mjs'

export const expose = await shell.expose({
  rpc: {
    login: {
      guard: () => void 0,
      fn: ({ email, password }: { email: string; password: string }) => {
        return login({ email, password })
      },
    },
    signup: {
      guard: () => void 0,
      fn: (signupReq: SignupReq) => {
        return signup(signupReq)
      },
    },
    confirm: {
      guard: () => void 0,
      fn: ({ token }: { token: string }) => {
        return confirm({ token })
      },
    },
  },
})
