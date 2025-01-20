import { isErrorXxx } from '@moodle/domain'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { configurator, configuratorDrain } from './default-configurator'
import { httpBinderReceiverProvider } from './http-binder-receiver'

dotenvExpand(dotenv.config())
;(async () => {
  const { binderReceiver, drain: httpReceiverDrain } = await httpBinderReceiverProvider()

  process.on('SIGINT', drainAndExit)
  process.on('SIGTERM', drainAndExit)
  process.on('unhandledRejection', (reason, promise) => {
    if (isErrorXxx(reason)) {
      return
    }
    console.error('^^^ CRITICAL UNHANDLED_REJECTION ^^^', { reason, promise }, '$$$ CRITICAL UNHANDLED_REJECTION $$$')
    drainAndExit('unhandledRejection')
  })

  binderReceiver({
    binderDispatcher: async ({ domainAccess }) => {
      const { loopbackDispatcher /* , configuration */ } = await configurator({
        domainName: domainAccess.domain,
      })
      loopbackDispatcher
      return loopbackDispatcher({ domainAccess })
      // return accessDomain({ domainAccess, configuration, loopbackDispatcher })
    },
  })
  let exiting = false
  async function drainAndExit(sig: unknown) {
    if (exiting) {
      return
    }
    exiting = true
    console.log(`received signal ${sig} draining...`)
    await Promise.all([configuratorDrain(), httpReceiverDrain()])
    console.log(`exiting...`)
    process.exit(0)
  }
})()
