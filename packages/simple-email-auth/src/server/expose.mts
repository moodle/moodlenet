import type { SimpleEmailAuthExposeType } from '../common/expose-def.mjs'
import {
  changeMyPasswordUsingToken,
  confirm,
  login,
  sendChangePasswordRequestEmail,
  signup,
} from './lib.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose<SimpleEmailAuthExposeType>({
  rpc: {
    'login': {
      guard: () => void 0,
      async fn({ email, password }) {
        const resp = await login({ email, password })
        return { success: resp.success }
      },
    },
    'signup': {
      guard: () => void 0,
      async fn(signupReq) {
        const resp = await signup(signupReq)
        if (!resp.success) {
          return { success: resp.success, msg: resp.msg }
        }
        return { success: resp.success }
      },
    },
    'confirm': {
      guard: () => void 0,
      async fn({ confirmToken }) {
        const resp = await confirm({ confirmToken })
        if (!resp.success) {
          return { success: resp.success, msg: resp.msg }
        }
        return { success: resp.success, emailPwdUser: resp.emailPwdUser }
      },
    },
    'webapp/change-password': {
      guard: () => void 0,
      async fn({ password, token }) {
        const done = await changeMyPasswordUsingToken({ newPassword: password, token })
        return { success: done }
      },
    },
    'webapp/request-password-change': {
      guard: () => void 0,
      async fn({ email }) {
        sendChangePasswordRequestEmail({ email })
      },
    },
  },
})
