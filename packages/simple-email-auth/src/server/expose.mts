import type { SimpleEmailAuthExposeType } from '../common/expose-def.mjs'
import { confirm, login, signup } from './lib.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose<SimpleEmailAuthExposeType>({
  rpc: {
    login: {
      guard: () => void 0,
      async fn({ email, password }) {
        return login({ email, password })
      },
    },
    signup: {
      guard: () => void 0,
      async fn(signupReq) {
        return signup(signupReq)
      },
    },
    confirm: {
      guard: () => void 0,
      async fn({ confirmToken }) {
        return confirm({ confirmToken })
      },
    },
  },
})
