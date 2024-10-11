// import * as env from '../../env'
import * as iam from '../../iam'
import * as net from '../../net'
import * as netWebappNextjs from '../../netWebappNextjs'
import * as org from '../../org'
import * as storage from '../../storage'
import * as userHome from '../../user-home'

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
