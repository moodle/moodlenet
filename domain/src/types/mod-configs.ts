// import * as env from '../../env'
import { email_address } from '@moodle/lib-types'
import * as iam from '../modules/iam'
import * as net from '../modules/net'
import * as netWebappNextjs from '../modules/netWebappNextjs'
import * as org from '../modules/org'
import * as storage from '../modules/storage'
import * as userHome from '../modules/userHome'

export type sys_admin_info = { email: email_address }

export type modConfigName = keyof ModConfigs
export interface ModConfigs {
  org: org.Configs
  iam: iam.Configs
  net: net.Configs
  netWebappNextjs: netWebappNextjs.Configs
  userHome: userHome.Configs
  storage: storage.Configs
  // env: env.Configs
}
