import { defApi } from '@moodlenet/core'
import { confirm, login, signup } from './lib.mjs'
import { SignupReq } from './types.mjs'

export default {
  login: defApi(
    _ctx =>
      ({ email, password }: { email: string; password: string }) => {
        return login({ email, password })
      },
    () => true,
  ),
  signup: defApi(
    _ctx => (signupReq: SignupReq) => {
      return signup(signupReq)
    },
    () => true,
  ),
  confirm: defApi(
    _ctx =>
      ({ token }: { token: string }) => {
        return confirm({ token })
      },
    () => true,
  ),
}
