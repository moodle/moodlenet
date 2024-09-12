'use server'

import { lib_moodle_iam } from '@moodle/lib-domain'
import { redirect } from 'next/navigation'

export async function login(loginForm: lib_moodle_iam.v0_1.loginForm) {
  console.log({ loginForm })
  redirect('/')
}
