import { PkgExposeDef } from '@moodlenet/core'
import { EmailPwdUser } from '../server/store/types.mjs'
import { SignupReq } from '../server/types.mjs'
export type SimpleEmailAuthExposeType = PkgExposeDef<{
  rpc: {
    login(body: {
      email: string
      password: string
    }): Promise<{ success: true } | { success: false }>
    signup(body: SignupReq): Promise<{ success: true } | { success: false; msg: string }>
    confirm(body: {
      confirmToken: string
    }): Promise<{ success: true; emailPwdUser: EmailPwdUser } | { success: false; msg: string }>
  }
}>
