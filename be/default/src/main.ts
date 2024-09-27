import { http_bind } from '@moodle/bindings-node'
import { core_factory, sec_factory, domainSessionAccess } from '@moodle/lib-ddd'
import * as mod_iam from '@moodle/mod-iam'
import * as mod_net from '@moodle/mod-net'
import * as mod_net_webapp_nextjs from '@moodle/mod-net-webapp-nextjs'
import * as mod_org from '@moodle/mod-org'
import { get_arango_persistence_factory } from '@moodle/sec-db-arango'

import { get_default_crypto_secondarys_factory } from '@moodle/sec-crypto-default'
import { get_nodemailer_secondarys_factory } from '@moodle/sec-email-nodemailer'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { migrate } from './migrate'
import { dotEnvLoader, Env, EnvProvider } from './types'
const loadDotEnv: dotEnvLoader = options => {
  return dotenvExpand(dotenv.config(options))
}
loadDotEnv()
const MOODLE_ENV_PROVIDER_MODULE =
  process.env.MOODLE_ENV_PROVIDER_MODULE ?? './default-env-provider.js'
const MOODLE_HTTP_BINDER_PORT = parseInt(process.env.MOODLE_HTTP_BINDER_PORT ?? '8000')
const MOODLE_HTTP_BINDER_BASEURL = process.env.MOODLE_HTTP_BINDER_BASEURL ?? '/'

http_bind.server({
  port: MOODLE_HTTP_BINDER_PORT,
  baseUrl: MOODLE_HTTP_BINDER_BASEURL,
  async request({ access_session, domain_msg }) {
    const _env_provider: EnvProvider = (await import(MOODLE_ENV_PROVIDER_MODULE)).default.default
    const { env, migration_status } = await _env_provider({ access_session, migrate, loadDotEnv })

    // this could be inspected later to respond immediately with a "under maintainance" status
    await migration_status
    const core_factories: core_factory[] = [
      // core modules
      mod_net.core(),
      mod_org.core(),
      mod_iam.core(),
      mod_net_webapp_nextjs.core(),
    ]

    const sec_factories: sec_factory[] = [
      // sec modules
      get_arango_persistence_factory(env.arango_db),
      get_default_crypto_secondarys_factory(env.crypto),
      get_nodemailer_secondarys_factory(env.nodemailer),
      env_provider_secondarys_factory(),
    ]
    return domainSessionAccess({ access_session, domain_msg, core_factories, sec_factories })

    function env_provider_secondarys_factory(): sec_factory {
      return async function factory(/* ctx */) {
        // console.log('env_provider_secondarys_factory', inspect(env, false, 15, true))
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
  },
})

