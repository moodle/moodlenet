import { http_bind } from '@moodle/bindings/node'
import {
  concrete,
  CoreContext,
  createAcccessProxy,
  dispatch,
  Modules,
  MoodleDomain,
} from '@moodle/domain'
import { _any } from '@moodle/lib/types'
import * as mod_moodle from '@moodle/mod/moodle'
import { merge } from 'lodash'

http_bind.server({
  port: 9000,
  baseUrl: '/',
  access({ domain_msg, layer }) {
    const { mod } = createAcccessProxy({ access: console.log.bind(null, 'access') })
    const ctx: CoreContext = { mod, primarySession: layer }
    const domain: MoodleDomain = {
      version: '5.0',
      modules: compose(
        mod_moodle.eml_pwd_auth.core()(ctx),
        mod_moodle.net.core()(ctx),
        mod_moodle.iam.core()(ctx),
      ),
    }
    return dispatch(domain, domain_msg, found => {
      const { channel, layer, mod, ns, port, version } = domain_msg
      const err_msg = `NOT IMPLEMENTED ${ns}.${mod}.${version}.${layer}.${channel}.${port}.`
      //FIXME - log to a logger instead of console (would be a secondary ?) ... but maybe not here .. we're in a low level module here .. so console is fine .. but we should have a logger in the domain layer that we can use  .. and we should have a way to configure it .. and we should have a way to inject it .. and we should have a way to test it .. and we should have a way to mock it .. and we should have a way to trace it .. and we should have a way to monitor it .. and we should have a way to alert on it .. and we should have a way to throttle it .. and we should have a way to rate limit it .. and we should have a way to cache it .. and we should have a way to retry it .. and we should have a way to circuit break it .. and we should have a way to trace it .. and we should have a way to monitor it .. and we should have a way to alert on it .. and we should have a way to throttle it .. and we should have a way to rate limit it .. and we should have a way to cache it .. and we should have a way to retry it .. and we should have a way to circuit break it ..
      console.error(err_msg, found)
      // throw new Error(err_msg)
    })
  },
})

function compose(...partials: concrete<_any>[]): Modules {
  return merge({}, ...partials)
}
