import type authConn from '@moodlenet/authentication-manager'
import type graphConn from '@moodlenet/content-graph'
import type organizationConn from '@moodlenet/organization'
import type reactAppConn from '../main.mjs'

export type WebPkgDeps = [
  typeof reactAppConn,
  typeof organizationConn,
  typeof authConn,
  typeof graphConn,
]
