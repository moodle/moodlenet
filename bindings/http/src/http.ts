import { code4xx_2_http, codeHttp_2_m_4xx, Error4xx, error4xxDetails, isError4xx } from '@moodle/domain/lib'
import { any_ } from '@moodle/lib-types'
import cors from 'cors'
import express from 'express'
import { Either, isLeft } from 'fp-ts/Either'
import { Agent, fetch } from 'undici'

const PROTOCOL_CONTENT_TYPE = 'text/plain; charset=utf-8'

type dispatcher<payload> = (msg: payload) => Promise<Either<Error4xx, unknown>>
type payloadT = { path: string[] }
type reqHttpTarget = {
  host: string
  port: number
  basePath: string
  secure: boolean
}

// FIXME: get a Logger here
export function getHttpBinderDispatcher<payload extends payloadT>({
  reqHttpTarget,
  agentOpts,
}: {
  reqHttpTarget: string | reqHttpTarget
  agentOpts?: Agent.Options
}): dispatcher<payload> {
  const httpAgent = new Agent({
    pipelining: 2,
    keepAliveMaxTimeout: 600e3, //default
    keepAliveTimeout: 4e3, //default
    keepAliveTimeoutThreshold: 1e3, //default
    ...agentOpts,
  })

  return async function request(payload) {
    const url =
      typeof reqHttpTarget === 'string'
        ? new URL([reqHttpTarget, ...payload.path].join('/'))
        : new URL([reqHttpTarget.basePath, ...payload.path].join('/'), `${reqHttpTarget.secure ? 'https' : 'http'}://${reqHttpTarget.host}:${reqHttpTarget.port}`)

    const body = _serial(payload)
    const replyPromise = fetch(url, {
      method: 'POST',
      body,
      dispatcher: httpAgent,
      headers: { 'Content-Type': PROTOCOL_CONTENT_TYPE },
    })
      .then(async httpResponse => {
        const is2xx = httpResponse.status >= 200 && httpResponse.status < 300
        const jsonBodyStrUtf8 = await httpResponse.text()
        if (is2xx) {
          const jsonBody = _parse(jsonBodyStrUtf8)
          return jsonBody
        }

        const m_code_4xx = codeHttp_2_m_4xx(httpResponse.status)
        if (m_code_4xx) {
          const jsonBody = _parse(jsonBodyStrUtf8)
          throw new Error4xx(m_code_4xx, jsonBody?.details)
        }

        throw new Error(`Server error: ${httpResponse.status}\n ${jsonBodyStrUtf8}`)
      })
      .catch(e => {
        console.error('HttpBinderDispatcher fetchError', e)
        throw e
      })

    return replyPromise
  }
}

type srv_cfg = {
  port: number
  basePath: string
}
type httpBinderReceiverHandle<payload> = {
  receiver: (_: { dispatcher: dispatcher<payload> }) => void
  drain: () => Promise<void>
}

// FIXME: get a Logger here
export async function getHttpBinderReceiver<payload extends payloadT>({ port, basePath }: srv_cfg): Promise<httpBinderReceiverHandle<payload>> {
  const pendingReplyPromises: Promise<unknown>[] = []
  let receiverDispatcher: dispatcher<payload> = async () => {
    throw new Error4xx('Service Unavailable')
  }
  let draining = false
  const app = express()

  // NOTICE: added for DEV: check the proper way
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests from all localhost origins
        if (!origin || origin.startsWith('http://localhost:')) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    }),
  )

  app.use(express.text({ defaultCharset: 'utf-8' }))
  const router = express.Router().use(async (req, res) => {
    if (draining) {
      res.status(503).send('Service Unavailable')
      return
    }
    res.setHeader('Content-Type', PROTOCOL_CONTENT_TYPE)
    // const path = req.url.replace(/^\//, '').split('/')
    const payload = _parse(req.body)

    const replyPromise = receiverDispatcher(payload).then(
      either_result => {
        if (isLeft(either_result)) {
          res.status(code4xx_2_http(either_result.left.code))
          return { details: either_result.left.details }
        }
        return either_result.right
      },
      e => {
        console.error('HttpBinderReceiver error: ', e)
        res.status(isError4xx(e) ? code4xx_2_http(e.code) : 500)
        const details: error4xxDetails = isError4xx(e) ? e.details : e instanceof Error ? { error: e.name, message: e.message, stack: e.stack } : { message: String(e) }
        return { details }
      },
    )

    pendingReplyPromises.push(replyPromise)
    replyPromise.finally(() => pendingReplyPromises.splice(pendingReplyPromises.indexOf(replyPromise), 1))
    res.send(_serial(await replyPromise))
  })
  app.use(basePath, router)

  return new Promise<void>((resolve /* , reject */) => {
    app.listen(port, () => {
      console.log(`http receiver listening on port ${port}`)
      resolve()
    })
  }).then<httpBinderReceiverHandle<payload>>(() => {
    return {
      async drain() {
        draining = true
        console.log(`draining http receiver [#${pendingReplyPromises.length}] pending replies ...`)
        await Promise.allSettled(pendingReplyPromises)
        console.log('drained http receiver pending replies')
      },
      receiver(_) {
        receiverDispatcher = _.dispatcher
      },
    }
  })
}
const _VOID_VALUE_ = '\u0000'

function _parse(_: string) {
  return _ === _VOID_VALUE_ ? void 0 : JSON.parse(_, reviver)
}
function _serial(_: any_) {
  return _ === void 0 ? _VOID_VALUE_ : JSON.stringify(_, replacer)
}
function replacer(_key: string, val: any_) {
  return val === void 0 ? _VOID_VALUE_ : val
}
function reviver(_key: string, val: any_) {
  return val === _VOID_VALUE_ ? void 0 : val
}
