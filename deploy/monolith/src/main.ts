import { http_bind } from '@moodle/bindings/node'
import {
  composeImpl,
  CoreContext,
  createAcccessProxy,
  dispatch,
  domain_msg,
  MoodleDomain,
  WorkerContext,
} from '@moodle/core'
import * as mod_moodle from '@moodle/mod/index'
import { get_arango_persistence_factory } from '@moodle/sec/persistence/arangodb'
import { get_dbs_struct_configs_0_1 } from './env'

http_bind.server({
  port: 9000,
  baseUrl: '/',
  async request({ domain_msg, primarySession }) {
    const dbs_struct_configs_0_1 = get_dbs_struct_configs_0_1()

    const monolithAccessProxy = createAcccessProxy({
      access(msg) {
        if (msg.layer === 'sec' || msg.layer === 'pri') {
          return dispatch(moodleDomain, msg, not_implemented_here(msg))
        } else if (msg.layer === 'evt') {
          'TODO'
          // dispatch on every mod_moodle.*.factory<'evt'> (loop)
        } else {
          throw TypeError(`unknown msg layer: ${msg.layer}`)
        }
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
        get_arango_persistence_factory({
          dbs_struct_configs_0_1,
        })(workerCtx),
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
