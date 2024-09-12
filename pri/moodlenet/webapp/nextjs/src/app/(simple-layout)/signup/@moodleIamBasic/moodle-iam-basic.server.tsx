'use server'

import { lib_moodle_iam } from '@moodle/lib-domain'
import { redirect } from 'next/navigation'

export async function signup(signupForm: lib_moodle_iam.v0_1.signupForm) {
  console.log({ signupForm })
  // revalidatePath('/signup')
  redirect('/')
}

