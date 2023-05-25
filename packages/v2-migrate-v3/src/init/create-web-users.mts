import { confirm, signup } from '@moodlenet/simple-email-auth/server'
import { toggleWebUserIsAdmin } from '@moodlenet/web-user/server'
import assert from 'assert'
import type * as v2 from '../v2-types/v2.mjs'

export const EmailUserIdMapping: Record<string, string> = {}
export const ProfileIdMapping: Record<string, string> = {}

const V2_ROOT_USER_ID = 'User/203565'
declare const v2_profile: v2.Profile
declare const v2_user: v2.ActiveUser

const signupResp = await signup({
  displayName: v2_profile.name,
  email: v2_user.email,
  password: '__temp__',
})
assert(signupResp.success)
const { confirmEmailToken } = signupResp
const confirmResp = await confirm({ confirmToken: confirmEmailToken })
assert(confirmResp.success)
const { emailPwdUser, newWebUser, newProfile } = confirmResp
//changePassword(emailPwdUser._key, v2_user.password )

if (V2_ROOT_USER_ID === v2_user.id) {
  await toggleWebUserIsAdmin({ profileKey: newProfile._key })
}
