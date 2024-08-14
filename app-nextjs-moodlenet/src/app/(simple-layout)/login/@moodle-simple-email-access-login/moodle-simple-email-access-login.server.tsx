'use server'

// import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { loginFormValues } from './moodle-simple-email-access-login.common'

export async function login(loginFormValues: loginFormValues) {
  console.log({ loginFormValues })
  // revalidatePath('/login')
  redirect('/')
}
