import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { Binder, Configurator, session_deployer } from './types.js'
dotenvExpand(dotenv.config())

const binderPromise = process.env.MOODLE_BINDER_MODULE
  ? import(process.env.MOODLE_BINDER_MODULE)
  : import('./default-binder.js')

binderPromise.then(({ default: { default: binder } }: { default: { default: Binder } }) => {
  binder({
    domain_session_access: async ({ access_session, domain_msg }) => {
      const configurator: Configurator = (
        process.env.MOODLE_CONFIGURATOR_MODULE
          ? await import(process.env.MOODLE_CONFIGURATOR_MODULE)
          : await import('./default-configurator.js')
      ).default.default
      const { core_factories, sec_factories } = await configurator({ access_session })

      const session_deployer: session_deployer = (
        process.env.MOODLE_DEPLOYMENT_MODULE
          ? await import(process.env.MOODLE_DEPLOYMENT_MODULE)
          : await import('./default-session-deployment.js')
      ).default.default
      return session_deployer({ access_session, core_factories, domain_msg, sec_factories })
    },
  })
})
