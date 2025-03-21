import { http_bind } from '@moodle/bindings-http'
import { gateCore, isError4xx } from '@moodle/domain/lib'
import { any_ } from '@moodle/lib-types'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { defaultConfigurator } from './default-configurator'
import { configuration } from './types'

dotenvExpand(dotenv.config())

const MOODLE_MASTER_INSTANCE = process.env.MOODLE_MASTER_INSTANCE === 'true'
const MOODLE_HTTP_BINDER_RECEIVER_PORT = parseInt(process.env.MOODLE_HTTP_BINDER_RECEIVER_PORT ?? '8000')
const MOODLE_HTTP_BINDER_RECEIVER_BASEURL = process.env.MOODLE_HTTP_BINDER_RECEIVER_BASEURL ?? '/'

http_bind
  .getHttpBinderReceiver<moo.def.gate.provider.request>({
    port: MOODLE_HTTP_BINDER_RECEIVER_PORT,
    basePath: MOODLE_HTTP_BINDER_RECEIVER_BASEURL,
  })
  .then(httpGate => {
    process.on('SIGINT', drainAndExit)
    process.on('SIGTERM', drainAndExit)

    process.on('unhandledRejection', (reason, promise) => {
      if (isError4xx(reason)) {
        return
      }
      console.error('^^^ CRITICAL UNHANDLED_REJECTION ^^^', { reason, promise }, '$$$ CRITICAL UNHANDLED_REJECTION $$$')
      drainAndExit('unhandledRejection')
    })

    const configurator = defaultConfigurator({ master: MOODLE_MASTER_INSTANCE })

    httpGate.receiver({
      dispatcher: async gateRequest => {
        const coreGateDeps = await configurator.gate({ gateRequest })
        return gateCore(coreGateDeps)
      },
    })

    // _____CALL____TEST____(configurator)

    let exiting = false

    async function drainAndExit(sig: unknown) {
      if (exiting) {
        return
      }
      if (process.env.NODE_ENV !== 'development') {
        exiting = true
        // FIXME: use a Logger
        console.log(`received signal [${sig}] draining...`)
        await Promise.all([configurator.drain(), httpGate.drain()])
      }
      console.log(`exiting...`)
      process.exit(0)
    }
  })

function _____CALL____TEST____(configurator: configuration) {
  configurator
    .gate({
      gateRequest: {
        form: {},
        path: ['a', 'a', 'a', 'a'],
        info: { claims: { server: { href: 'https://moodlenet.local/' as any_, authSessionToken: null, requestId: '11', ua: '313132' } } },
      },
    })
    .then(_ => gateCore(_))
    .then(console.log, console.error)
    .then(() =>
      configurator.gate({
        gateRequest: {
          form: {},
          path: ['a', 'a', 'a', 'a'],
          info: { claims: { server: { href: 'https://moodlenet.local/' as any_, authSessionToken: null, requestId: '11', ua: '313132' } } },
        },
      }),
    )
    .then(_ => gateCore(_))
    .then(console.log, console.error)
}

