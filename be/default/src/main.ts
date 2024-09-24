import { http_bind } from '@moodle/bindings-node'
import {
  composeImpl,
  core_impl,
  CoreContext,
  coreModId,
  createAcccessProxy,
  dispatch,
  domain_msg,
  sec_impl,
  TransportData,
  WorkerContext,
} from '@moodle/lib-ddd'
import * as mod_iam from '@moodle/mod-iam'
import * as mod_net from '@moodle/mod-net'
import * as mod_net_webapp_nextjs from '@moodle/mod-net-webapp-nextjs'
import * as mod_org from '@moodle/mod-org'
import { get_arango_persistence_factory } from '@moodle/sec-db-arango'

import { get_default_crypto_workers_factory } from '@moodle/sec-crypto-default'
import { get_nodemailer_workers_factory } from '@moodle/sec-email-nodemailer'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { migrate } from './migrate'
import { EnvProvider } from './types'
dotenvExpand(dotenv.config({ path: process.env.MOODLE_DOTENV_PATH }))

http_bind.server({
  port: 9000,
  baseUrl: '/',
  request(td) {
    return request(td)
  },
})

async function request(transportData: TransportData) {
  const { domain_msg, primary_session, core_mod_id } = transportData

  const _env_provider: EnvProvider = (
    await import(process.env.MOODLE_ENV_PROVIDER_MODULE ?? './default-env-provider.js')
  ).default.default
  const { env, migration_status } = await _env_provider({ primary_session, migrate })

  // this could be inspected later to respond immediately with a "under maintainance" status
  await migration_status

  const defaultAccessProxy = createAcccessProxy({
    access(msg) {
      const core_mod_id = coreModId(domain_msg)
      return request({ domain_msg: msg, primary_session, core_mod_id }).catch(e => {
        console.error({ msg })
        throw e
      })
    },
  })

  const coreCtx: CoreContext = {
    primarySession: primary_session,
    forward: defaultAccessProxy.mod,
    worker: defaultAccessProxy.mod,
    transportData,
  }

  const core_impls: core_impl[] = [
    // core modules
    await mod_net.core()(coreCtx),
    await mod_org.core()(coreCtx),
    await mod_iam.core()(coreCtx),
    await mod_net_webapp_nextjs.core()(coreCtx),
  ]
  const core = composeImpl(...core_impls)

  const workerCtx: WorkerContext | null = core_mod_id
    ? { primarySession: primary_session, emit: defaultAccessProxy.mod, core_mod_id, transportData }
    : null

  const sec_impls: sec_impl[] = workerCtx
    ? [
        // sec modules
        await get_arango_persistence_factory(env.arango_db)(workerCtx),
        await get_default_crypto_workers_factory(env.crypto)(workerCtx),
        await get_nodemailer_workers_factory(env.nodemailer)(workerCtx),
      ]
    : []
  const sec = composeImpl(...sec_impls)

  // console.log(inspect(moodleDomain, true, 10, true))
  if (domain_msg.layer === 'pri') {
    return dispatch(core, domain_msg, not_implemented_here(domain_msg))
  } else if (domain_msg.layer === 'sec') {
    return dispatch(sec, domain_msg, not_implemented_here(domain_msg))
  } else if (domain_msg.layer === 'evt') {
    core_impls.forEach(core_impl => {
      dispatch(core_impl, domain_msg, not_implemented_here(domain_msg))
    })
  } else {
    throw TypeError(`unknown msg layer: ${domain_msg.layer}`)
  }
}
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
