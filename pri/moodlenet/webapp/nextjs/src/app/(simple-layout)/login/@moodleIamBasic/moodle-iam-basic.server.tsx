'use server'

import { lib_moodle_iam } from '@moodle/lib-domain'
import { redirect } from 'next/navigation'
import { getMod } from '../../../../lib/server/session-access'
import { setAuthTokenCookie } from '../../../../lib/server/auth'
import { revalidatePath } from 'next/cache'

export type loginResponse = void | { loginFailed: true }
export async function login(loginForm: lib_moodle_iam.v1_0.loginForm): Promise<loginResponse> {
  const {
    moodle: {
      iam: {
        v1_0: {
          pri: {
            myAccount: { login },
          },
        },
      },
    },
  } = getMod()
  const [loginSuccess, loginResponse] = await login({ loginForm })
  if (!loginSuccess) {
    return { loginFailed: true }
  }
  setAuthTokenCookie(loginResponse.sessionToken)
  revalidatePath('/', 'layout')
  redirect('/')
}
