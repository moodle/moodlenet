import { intersection } from '@moodle/lib-types'
import env from './modules/env'
import userAccount from './modules/user-account'
import moodlenet from './modules/moodlenet'
import moodlenetReactApp from './modules/moodlenet-react-app'
import org from './modules/org'
import storage from './modules/storage'
import userProfile from './modules/user-profile'
import crypto from './modules/crypto'
import userNotification from './modules/user-notification'

export type MoodleDomain = intersection<
  [{ version: '5.0' }, env, userAccount, moodlenet, moodlenetReactApp, org, storage, userProfile, crypto, userNotification]
>
