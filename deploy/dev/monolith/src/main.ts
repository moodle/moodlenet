import { getTransport } from '@moodle/core/transport'
import * as emlPwdAuth from '@moodle/mod/eml-pwd-auth'
import * as iam from '@moodle/mod/iam'
import * as net from '@moodle/mod/net'
getTransport('ctrl', 'http::8100').then(async register => {
  {
    register(async () => ({
      'iam': iam.ctrl,
      'net': net.ctrl,
      'moodle-eml-pwd-auth': emlPwdAuth.ctrl,
    }))
  }
})
