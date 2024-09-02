import { http_bind } from '@moodle/bindings/node'
import {
  composeImpl,
  CoreContext,
  createAcccessProxy,
  dispatch,
  domain_msg,
  impl,
  Modules,
  MoodleDomain,
  WorkerContext,
} from '@moodle/domain'
import { _any } from '@moodle/lib/types'
import * as mod_moodle from '@moodle/mod/moodle'
import { db_sec_arango } from '@moodle/sec/db/arango'

http_bind.server({
  port: 9000,
  baseUrl: '/',
  request({ domain_msg, primarySession }) {
    const monolithAccessProxy = createAcccessProxy({
      access(msg) {
        msg.layer
        return dispatch(moodleDomain, msg, not_implemented_here(msg))
      },
    })

    const coreCtx: CoreContext = {
      primarySession,
      forward: monolithAccessProxy.mod,
      worker: monolithAccessProxy.mod,
    }
    const workerCtx: WorkerContext = { primarySession, emit: monolithAccessProxy.mod }

    const moodleDomain: MoodleDomain = {
      version: '5.0',
      modules: composeImpl(
        // core modules
        mod_moodle.eml_pwd_auth.core()(coreCtx),
        mod_moodle.net.core()(coreCtx),
        mod_moodle.iam.core()(coreCtx),
        // sec modules
        db_sec_arango({ arangodbUrl: process.env.ARANGODB_URL })(workerCtx),
      ),
    }
    // console.log(inspect(moodleDomain, true, 10, true))

    return dispatch(moodleDomain, domain_msg, not_implemented_here(domain_msg))
  },
})

function not_implemented_here(domain_msg: domain_msg): (found: unknown) => void {
  return found => {
    const { channel, layer, mod, ns, port, version } = domain_msg
    const err_msg = `
NOT IMPLEMENTED: ${ns}.${mod}.${version}.${layer}.${channel}.${port}
FOUND: [${String(found)}]
`
    throw TypeError(err_msg)
  }
}

