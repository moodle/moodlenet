// import * as env from '../../env'
import { email_address } from '@moodle/lib-types'
import * as userAccount from '../modules/user-account'
import * as net from '../modules/net'
import * as netWebappNextjs from '../modules/net-webapp-nextjs'
import * as org from '../modules/org'
import * as storage from '../modules/storage'
import * as userProfile from '../modules/user-profile'

export type sys_admin_info = { email: email_address }

export type modConfigName = keyof ModConfigs
export interface ModConfigs {
  org: org.Configs
  userAccount: userAccount.Configs
  net: net.configs
  netWebappNextjs: netWebappNextjs.Configs
  userProfile: userProfile.Configs
  storage: storage.Configs
  // env: env.Configs
}
