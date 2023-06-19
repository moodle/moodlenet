import type { SimpleEmailAuthExposeType } from '../common/expose-def.mjs'
import {
  changeMyPasswordUsingToken,
  changePassword,
  confirm,
  getCurrentEmailPwdUser,
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
    'webapp/change-password-using-token': {
      guard: () => void 0,
      async fn({ password, token }) {
        const done = await changeMyPasswordUsingToken({ newPassword: password, token })
        return { success: done }
      },
    },
    'webapp/set-password': {
      guard: () => void 0,
      async fn({ password }) {
        const currentEmailPwdUser = await getCurrentEmailPwdUser()
        if (!currentEmailPwdUser) {
          return false
        }
        await changePassword({ newPassword: password, _key: currentEmailPwdUser._key })
        return true
      },
    },
    'webapp/get-my-settings-data': {
      guard: () => void 0,
      async fn() {
        const currentEmailPwdUser = await getCurrentEmailPwdUser()
        if (!currentEmailPwdUser) {
          return null
        }
        return { email: currentEmailPwdUser.email }
      },
    },
    'webapp/request-password-change-by-email-link': {
      guard: () => void 0,
      async fn({ email }) {
        sendChangePasswordRequestEmail({ email })
      },
    },
  },
})
