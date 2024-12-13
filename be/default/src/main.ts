import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { configurator, mainBinderDispatcher } from './types.js'
import { _maybe } from '@moodle/lib-types'
import { binderReceiver } from '@moodle/domain'
dotenvExpand(dotenv.config())

optimport<binderReceiver>(process.env.MOODLE_BINDER_RECEIVER_MODULE, './simple-http-binder.js').then(messageReceiver => {
  messageReceiver({
    binderDispatcher: async ({ domainAccess }) => {
      const configurator = await optimport<configurator>(process.env.MOODLE_CONFIGURATOR_MODULE, './default-configurator.js')
      const configuration = await configurator({
        domainAccess,
        loggerConfigs: { consoleLevel: 'debug' },
      })

      const binderDispatcher = await optimport<mainBinderDispatcher>(
        process.env.MOODLE_DISPATCHER_MODULE,
        './feedbackloop-binder-dispatcher.js',
      )
      return binderDispatcher({
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
