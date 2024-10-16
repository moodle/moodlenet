import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { binder, configurator, mainMessageDispatcher } from './types.js'
import { _maybe } from '@moodle/lib-types'
dotenvExpand(dotenv.config())

optimport<binder>(process.env.MOODLE_BINDER_MODULE, './default-binder.js').then(binder => {
  binder({
    messageDispatcher: async ({ domainAccess }) => {
      const configurator = await optimport<configurator>(
        process.env.MOODLE_CONFIGURATOR_MODULE,
        './default-configurator.js',
      )
      const configuration = await configurator({
        domainAccess,
        loggerConfigs: { consoleLevel: 'debug' },
      })

      const messageDispatcher = await optimport<mainMessageDispatcher>(
        process.env.MOODLE_DISPATCHER_MODULE,
        './default-message-dispatcher.js',
      )
      return messageDispatcher({
        configuration,
        domainAccess,
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
