// import * as env from '../../env'
import { email_address } from '@moodle/lib-types'
import * as userAccount from '../modules/user-account'
import * as moodlenet from '../modules/moodlenet'
import * as moodlenetReactApp from '../modules/moodlenet-react-app'
import * as org from '../modules/org'
import * as storage from '../modules/storage'
import * as userProfile from '../modules/user-profile'

export type sys_admin_info = { email: email_address }

export type modConfigName = keyof ModConfigs
export interface ModConfigs {
  org: org.Configs
  userAccount: userAccount.Configs
  moodlenet: moodlenet.configs
  moodlenetReactApp: moodlenetReactApp.Configs
  userProfile: userProfile.Configs
  storage: storage.Configs
  // env: env.Configs
}
