import { http_bind } from '@moodle/bindings-node'
import {
  composeImpl,
  core_impl,
  CoreContext,
  coreModId,
  createAcccessProxy,
  dispatch,
  domain_msg,
  primary_session,
  sec_impl,
  TransportData,
  SecondaryContext,
  sec_factory,
} from '@moodle/lib-ddd'
import * as mod_iam from '@moodle/mod-iam'
import * as mod_net from '@moodle/mod-net'
import * as mod_net_webapp_nextjs from '@moodle/mod-net-webapp-nextjs'
import * as mod_org from '@moodle/mod-org'
import { get_arango_persistence_factory } from '@moodle/sec-db-arango'

import { get_default_crypto_secondarys_factory } from '@moodle/sec-crypto-default'
import { get_nodemailer_secondarys_factory } from '@moodle/sec-email-nodemailer'
import { migrate } from './migrate'
import { dotEnvLoader, Env, EnvProvider } from './types'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
const loadDotEnv: dotEnvLoader = options => {
  return dotenvExpand(dotenv.config(options))
}
loadDotEnv()
const MOODLE_ENV_PROVIDER_MODULE =
  process.env.MOODLE_ENV_PROVIDER_MODULE ?? './default-env-provider.js'
const MOODLE_HTTP_BINDER_PORT = parseInt(process.env.MOODLE_HTTP_BINDER_PORT ?? '9000')
const MOODLE_HTTP_BINDER_BASEURL = process.env.MOODLE_HTTP_BINDER_BASEURL ?? '/'

http_bind.server({
  port: MOODLE_HTTP_BINDER_PORT,
  baseUrl: MOODLE_HTTP_BINDER_BASEURL,
  request(td) {
    return request(td)
  },
})

async function request(transportData: TransportData) {
  const { domain_msg, primary_session /* , core_mod_id */ } = transportData

  const _env_provider: EnvProvider = (await import(MOODLE_ENV_PROVIDER_MODULE)).default.default
  const { env, migration_status } = await _env_provider({ primary_session, migrate, loadDotEnv })

  // this could be inspected later to respond immediately with a "under maintainance" status
  await migration_status
  const core_mod_id = coreModId(domain_msg)

  const defaultAccessProxy = createAcccessProxy({
    access(msg) {
      return request({ domain_msg: msg, primary_session /* , core_mod_id */ }).catch(e => {
        console.error({ msg })
        throw e
      })
    },
  })
  const sysCallAccessProxy = createAcccessProxy({
    access(msg) {
      const core_mod_id = coreModId(domain_msg)
      const sysCallPrimarySession: primary_session = {
        type: 'system',
        domain: primary_session.domain,
        mod_id: core_mod_id,
      }
      return request({
        domain_msg: msg,
        primary_session: sysCallPrimarySession,
        // core_mod_id,
      }).catch(e => {
        console.error({ msg })
        throw e
      })
    },
  })

  const coreCtx: CoreContext = {
    primarySession: primary_session,
    forward: defaultAccessProxy.mod,
    sysCall: sysCallAccessProxy.mod,
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

  const secondaryCtx: SecondaryContext | null = core_mod_id
    ? {
        primarySession: primary_session,
        emit: sysCallAccessProxy.mod,
        modIdCaller: core_mod_id,
        transportData,
      }
    : null

  const sec_impls: sec_impl[] = secondaryCtx
    ? [
        // sec modules
        await get_arango_persistence_factory(env.arango_db)(secondaryCtx),
        await get_default_crypto_secondarys_factory(env.crypto)(secondaryCtx),
        await get_nodemailer_secondarys_factory(env.nodemailer)(secondaryCtx),
        await env_provider_secondarys_factory(env)(secondaryCtx),
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

function env_provider_secondarys_factory(env: Env): sec_factory {
  return async function factory(/* ctx */) {
    return {
      env: {
        deployments: {
          v1_0: {
            sec: {
              info: {
                async read() {
                  // console.log({ env })
                  return env.deployments
                },
              },
            },
          },
        },
      },
    }
  }
}
