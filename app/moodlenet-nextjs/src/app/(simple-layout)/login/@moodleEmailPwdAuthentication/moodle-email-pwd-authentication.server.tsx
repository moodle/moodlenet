'use server'

import { redirect } from 'next/navigation'
import { loginFormValues } from './moodle-email-pwd-authentication.common'

export async function login(loginFormValues: loginFormValues) {
  console.log({ loginFormValues })
  redirect('/')
}
