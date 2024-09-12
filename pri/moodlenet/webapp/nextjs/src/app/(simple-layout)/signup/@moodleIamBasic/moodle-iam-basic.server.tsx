'use server'

import { lib_moodle_iam } from '@moodle/lib-domain'
import { redirect } from 'next/navigation'
import { getMod } from '../../../../lib/server/session-access'

export async function signup(signupForm: lib_moodle_iam.v0_1.signupForm) {
  const {
    moodle: {
      iam: {
        v0_1: {
          pri: {
            signup: { apply },
          },
        },
      },
    },
  } = getMod()
  await apply({ signupForm })
  redirect('/')
}

