'use server'

import { loginFormValues } from '@moodle/domain/mod/moodle/eml-pwd-auth'
import { redirect } from 'next/navigation'

export async function login(loginFormValues: loginFormValues) {
  console.log({ loginFormValues })
  redirect('/')
}
