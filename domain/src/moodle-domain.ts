import { intersection } from '@moodle/lib-types'
import env from './modules/env'
import userAccount from './modules/user-account'
import moodlenet from './modules/moodlenet'
import moodlenetNextjs from './modules/moodlenet-nextjs'
import org from './modules/org'
import storage from './modules/storage'
import userProfile from './modules/user-profile'
import crypto from './modules/crypto'
import userNotification from './modules/user-notification'

export type MoodleDomain = intersection<
  [{ version: '5.0' }, env, userAccount, moodlenet, moodlenetNextjs, org, storage, userProfile, crypto, userNotification]
>
export type moodlePrimary = MoodleDomain['primary']
export type moodleModuleName = keyof moodlePrimary & keyof moodleSecondary
export type moodleSecondary = MoodleDomain['secondary']
export type moodleEvent = MoodleDomain['event']
