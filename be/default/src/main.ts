import { http_bind } from '@moodle/bindings-http'
import { isError4xx } from '@moodle/domain/lib'
import { any_ } from '@moodle/lib-types'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { configurator, configuratorDrain } from './default-configurator'

dotenvExpand(dotenv.config())
const MOODLE_HTTP_BINDER_RECEIVER_PORT = parseInt(process.env.MOODLE_HTTP_BINDER_RECEIVER_PORT ?? '8000')
const MOODLE_HTTP_BINDER_RECEIVER_BASEURL = process.env.MOODLE_HTTP_BINDER_RECEIVER_BASEURL ?? '/'

start()
async function start() {
  const httpGate = await http_bind.getHttpBinderReceiver<moo.gate.access<any_>>({
    port: MOODLE_HTTP_BINDER_RECEIVER_PORT,
    basePath: MOODLE_HTTP_BINDER_RECEIVER_BASEURL,
  })

  process.on('SIGINT', drainAndExit)
  process.on('SIGTERM', drainAndExit)

  process.on('unhandledRejection', (reason, promise) => {
    if (isError4xx(reason)) {
      return
    }
    console.error('^^^ CRITICAL UNHANDLED_REJECTION ^^^', { reason, promise }, '$$$ CRITICAL UNHANDLED_REJECTION $$$')
    drainAndExit('unhandledRejection')
  })
  
  httpGate.receiver({
    dispatcher: async gateAccess => {
      const {modelHandleForCore} = await model configurator({
        gateAccess,
        modelHandleForModel
      })

      return core configurator({ gateAccess , modelHandleForCore})
  },
  })

  let exiting = false

  async function drainAndExit(sig: unknown) {
    if (exiting) {
      return
    }
    exiting = true
    console.log(`received signal [${sig}] draining...`)
    await Promise.all([configuratorDrain(), httpGate.drain()])
    console.log(`exiting...`)
    process.exit(0)
  }
}
