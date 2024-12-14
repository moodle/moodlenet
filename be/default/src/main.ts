import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { configurator, loopbackDispatcherProvider } from './types.js'
import { _maybe } from '@moodle/lib-types'
import { binderReceiver } from '@moodle/domain'
import { provideDomainAccessDispatcher } from '@moodle/domain/lib'
dotenvExpand(dotenv.config())

import_with_default<binderReceiver>(process.env.MOODLE_BINDER_RECEIVER_MODULE, './http-binder-receiver.js').then(
  messageReceiver => {
    messageReceiver({
      binderDispatcher: async ({ domainAccess }) => {
        const configurator = await import_with_default<configurator>(
          process.env.MOODLE_CONFIGURATOR_MODULE,
          './default-configurator.js',
        )
        const configuration = await configurator({
          domainAccess,
          loggerConfigs: { consoleLevel: 'debug' },
        })

        const loopbackDispatcherProvider = await import_with_default<loopbackDispatcherProvider>(
          process.env.MOODLE_DISPATCHER_MODULE,
          './short-circuit-loopback-dispatcher-provider.js',
        )
        const loopbackDispatcher = await loopbackDispatcherProvider({ configuration })

        return provideDomainAccessDispatcher({
          configuration,
          loopbackDispatcher,
        })({ domainAccess })
      },
    })
  },
)

async function import_with_default<T>(maybe_module_path: _maybe<string>, default_module_path: string): Promise<T> {
  return (maybe_module_path ? await import(maybe_module_path) : await import(default_module_path)).default.default
}
