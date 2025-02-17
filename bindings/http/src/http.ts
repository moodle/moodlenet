import { Error4xx, isCode4xx } from '@moodle/domain/lib'
import { any_, path, serializable_object } from '@moodle/lib-types'
import express from 'express'
import { Agent, fetch } from 'undici'

const PROTOCOL_CONTENT_TYPE = 'text/plain; charset=utf-8'

type transportObject<pl extends payload> = pl & { path: path }
type binderDispatcher<pl extends payload> = (transportObject: transportObject<pl>) => Promise<unknown>
type payload = serializable_object

type reqHttpTarget = {
  host: string
  port: number
  basePath: string
  secure: boolean
}

export function getHttpBinderDispatcher<pl extends payload = payload>({
  reqHttpTarget,
  agentOpts,
}: {
  reqHttpTarget: string | reqHttpTarget
  agentOpts?: Agent.Options
}): binderDispatcher<pl> {
  const dispatcher = new Agent({
    pipelining: 2,
    keepAliveMaxTimeout: 600e3, //default
    keepAliveTimeout: 4e3, //default
    keepAliveTimeoutThreshold: 1e3, //default
    ...agentOpts,
  })

  return async function request({ path, ...payload }) {
    const url =
      typeof reqHttpTarget === 'string'
        ? new URL([reqHttpTarget, ...path].join('/'))
        : new URL(
            [reqHttpTarget.basePath, ...path].join('/'),
            `${reqHttpTarget.secure ? 'https' : 'http'}://${reqHttpTarget.host}:${reqHttpTarget.port}`,
          )

    const body = _serial(payload)
    const replyPromise = fetch(url, {
      method: 'POST',
      body,
      dispatcher,
      headers: { 'Content-Type': PROTOCOL_CONTENT_TYPE },
    })
      .then(async httpResponse => {
        const is2xx = httpResponse.status >= 200 && httpResponse.status < 300
        const jsonBodyStrUtf8 = await httpResponse.text()
        if (is2xx) {
          const jsonBody = _parse(jsonBodyStrUtf8)
          return jsonBody
        }
        if (isCode4xx(httpResponse.status)) {
          const jsonBody = _parse(jsonBodyStrUtf8)
          throw new Error4xx(httpResponse.status, jsonBody?.details)
        }
        throw new Error(`Server error: ${httpResponse.status}\n ${jsonBodyStrUtf8}`)
      })
      .catch(e => {
        console.error('HttpBinderDispatcher', e)
        throw e
      })

    return replyPromise
  }
}

type srv_cfg = {
  port: number
  basePath: string
}
type httpBinderReceiverHandle<pl extends payload> = {
  binderReceiver: (_: { binderDispatcher: binderDispatcher<pl> }) => void
  drain: () => Promise<void>
}

export async function getHttpBinderReceiver<pl extends payload>({
  port,
  basePath,
}: srv_cfg): Promise<httpBinderReceiverHandle<pl>> {
  const pendingReplyPromises: Promise<unknown>[] = []
  let binderDispatcher: binderDispatcher<pl> = async () => {
    throw new Error4xx('Service Unavailable')
  }

  const app = express()
  app.use(express.text({ defaultCharset: 'utf-8' }))
  const router = express.Router().use(async (req, res) => {
    res.setHeader('Content-Type', PROTOCOL_CONTENT_TYPE)
    const path = req.url.replace(/^\//, '').split('/')
    const payload = _parse(req.body)
    const transportObject: transportObject<pl> = { ...payload, path }

    const replyPromise = binderDispatcher(transportObject)
      .catch(e => {
        console.error('HttpBinderReceiver error: ', e)
        throw e
      })
      .catch(e => {
        if (e instanceof Error4xx) {
          res.status(e.code)
          return e
        } else {
          res.status(500)
          return e instanceof Error ? { name: e.name, message: e.message, stack: e.stack } : { error: String(e) }
        }
      })

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
  }).then<httpBinderReceiverHandle<pl>>(() => {
    return {
      async drain() {
        console.log(`draining http receiver [#${pendingReplyPromises.length}] pending replies ...`)
        await Promise.all(pendingReplyPromises)
        console.log('drained http receiver pending replies')
      },
      binderReceiver(_) {
        binderDispatcher = _.binderDispatcher
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
