import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { Binder, configurator, session_deployer } from './types.js'
import { _maybe } from '@moodle/lib-types'
dotenvExpand(dotenv.config())

optimport<Binder>(process.env.MOODLE_BINDER_MODULE, './default-binder.js').then(binder => {
  binder({
    domain_session_access: async ({ access_session, domain_msg }) => {
      const configurator = await optimport<configurator>(
        process.env.MOODLE_CONFIGURATOR_MODULE,
        './default-configurator.js',
      )
      const { core_factories, secondary_factories } = await configurator({
        access_session,
      })

      const session_deployer = await optimport<session_deployer>(
        process.env.MOODLE_DEPLOYMENT_MODULE,
        './default-session-deployment.js',
      )
      return session_deployer({
        domain_msg,
        access_session,
        core_factories,
        secondary_factories,
      })
    },
  })
})

async function optimport<T>(
  optional_module_path: _maybe<string>,
  default_module_path: string,
): Promise<T> {
  return (
    optional_module_path ? await import(optional_module_path) : await import(default_module_path)
  ).default.default
}
