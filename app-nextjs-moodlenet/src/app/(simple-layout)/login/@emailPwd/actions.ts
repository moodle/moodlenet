'use server'

// import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { loginFormValues } from './schema'

export async function login(loginFormValues: loginFormValues) {
  console.log({ loginFormValues })
  // revalidatePath('/login')
  redirect('/')
}
