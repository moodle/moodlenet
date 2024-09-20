'use server'

import { redirect } from 'next/navigation'
import { getMod } from '../../../../lib/server/session-access'
import { setAuthTokenCookie } from '../../../../lib/server/auth'
import { revalidatePath } from 'next/cache'
import { loginForm } from '@moodle/mod-iam/v1_0/types'

export type loginResponse = { loginFailed: true }
export async function login(loginForm: loginForm): Promise<loginResponse> {
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
  setAuthTokenCookie(loginResponse.session)
  revalidatePath('/', 'layout')
  redirect('/')
}
