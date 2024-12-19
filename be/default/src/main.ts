import { _maybe } from '@moodle/lib-types'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { binderReceiverProvider, configurator, loopbackProvider } from './types.js'
dotenvExpand(dotenv.config())
;(async () => {
  const configurator = await import_with_default<configurator>(
    process.env.MOODLE_CONFIGURATOR_MODULE,
    './default-configurator.js',
  )

  const loopbackProvider = await import_with_default<loopbackProvider>(
    process.env.MOODLE_DISPATCHER_MODULE,
    './short-circuit-loopback-dispatcher-provider.js',
  )

  const binderReceiverProvider = await import_with_default<binderReceiverProvider>(
    process.env.MOODLE_BINDER_RECEIVER_MODULE,
    './http-binder-receiver.js',
  )
  const { loopbackDispatcherProvider, drain: loopbackDrain } = await loopbackProvider()
  const { binderReceiver, drain: receiverDrain } = await binderReceiverProvider()

  process.on('SIGINT', drainAndExit)
  process.on('SIGTERM', drainAndExit)

  binderReceiver({
    binderDispatcher: async ({ domainAccess }) => {
      const { loopbackDispatcher /*, configuration*/ } = await configurator({
        domainName: domainAccess.domain,
        loopbackDispatcherProvider,
      })
      return loopbackDispatcher({ domainAccess })
    },
  })
  async function drainAndExit(sig: unknown) {
    console.log(`received signal ${sig} draining...`)
    await Promise.all([loopbackDrain?.(), receiverDrain?.()])
    console.log(`exiting...`)
    process.exit(0)
  }
})()

async function import_with_default<T>(maybe_module_path: _maybe<string>, default_module_path: string): Promise<T> {
  return (maybe_module_path ? await import(maybe_module_path) : await import(default_module_path)).default.default
}
