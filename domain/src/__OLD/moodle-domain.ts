import { pretty } from '@moodle/lib-types'
import crypto from './modules/crypto'
import edu from './modules/edu'
import env from './modules/env'
import moodlenet from './modules/moodlenet'
import moodlenetReactApp from './modules/moodlenet-react-app'
import org from './modules/org'
import resourceIngestion from './modules/resource-ingestion'
import storage from './modules/storage'
import userAccount from './modules/user-account'
import userNotification from './modules/user-notification'
import userProfile from './modules/user-profile'

export type MoodleDomain = pretty<
  { version: '5.0' } & edu &
    env &
    userAccount &
    moodlenet &
    moodlenetReactApp &
    org &
    storage &
    userProfile &
    crypto &
    userNotification &
    resourceIngestion
>
