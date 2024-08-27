import { getTransport } from '@moodle/core/transport'
import * as emlPwdAuth from '@moodle/mod/eml-pwd-auth'
import * as iam from '@moodle/mod/iam'
import * as net from '@moodle/mod/net'
import { inspect } from 'util'
getTransport('ctrl', 'http::8100').then(async register => {
  {
    register(async primarySession => {
      console.log(inspect({ primarySession }, true, 10, true))
      return {
        ...iam.ctrl,
        ...net.ctrl,
        ...emlPwdAuth.ctrl,
      }
    })
  }
})
