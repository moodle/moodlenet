import { binderDispatcher, binderReceiver, domainAccess, ErrorXxx, isCodeXxx, status_code_xxx } from '@moodle/domain'
import { _any } from '@moodle/lib-types'
import express from 'express'
import { Agent, fetch } from 'undici'

const PROTOCOL_CONTENT_TYPE = 'text/plain; charset=utf-8'

type reqHttpTarget = {
  host: string
  port: number
  basePath: string
  secure: boolean
}

export function getHttpBinderDispatcher({
  reqHttpTarget,
  agentOpts,
}: {
  reqHttpTarget: string | reqHttpTarget
  agentOpts?: Agent.Options
}): binderDispatcher {
  const dispatcher = new Agent({
    pipelining: 2,
    keepAliveMaxTimeout: 600e3, //default
    keepAliveTimeout: 4e3, //default
    keepAliveTimeoutThreshold: 1e3, //default
    ...agentOpts,
  })

  return async function request({ domainAccess }) {
    const { endpoint, ...accessBody } = domainAccess
    const url =
      typeof reqHttpTarget === 'string'
        ? new URL([reqHttpTarget, ...endpoint].join('/'))
        : new URL(
            [reqHttpTarget.basePath, ...endpoint].join('/'),
            `${reqHttpTarget.secure ? 'https' : 'http'}://${reqHttpTarget.host}:${reqHttpTarget.port}`,
          )

    const body = _serial(accessBody)
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
        if (isCodeXxx(httpResponse.status)) {
          const jsonBody = _parse(jsonBodyStrUtf8)
          throw new ErrorXxx(httpResponse.status as status_code_xxx, jsonBody?.details)
        }
        throw new Error(`Server error: ${httpResponse.status}\n ${jsonBodyStrUtf8}`)
      })
      .catch(e => {
        console.error(e)
        throw e
      })

    return domainAccess.async ? void 0 : replyPromise
  }
}

type srv_cfg = {
  port: number
  basePath: string
}
type httpBinderReceiverHandle = {
  binderReceiver: binderReceiver
  drain: () => Promise<void>
}

export async function getHttpBinderReceiver({ port, basePath }: srv_cfg): Promise<httpBinderReceiverHandle> {
  const pendingReplyPromises: Promise<unknown>[] = []
  let binderDispatcher: binderDispatcher = async () => {
    throw new ErrorXxx('Service Unavailable')
  }

  const app = express()
  app.use(express.text({ defaultCharset: 'utf-8' }))
  const router = express.Router().use(async (req, res) => {
    res.setHeader('Content-Type', PROTOCOL_CONTENT_TYPE)
    const endpointless_domain_access: Omit<domainAccess, 'endpoint'> = _parse(req.body)
    const domainAccess: domainAccess = {
      ...endpointless_domain_access,
      endpoint: req.url.replace(/^\//, '').split('/'),
    }
    const replyPromise = binderDispatcher({ domainAccess: domainAccess })
      .catch(e => {
        console.error(e)
        throw e
      })
      .catch(e => {
        if (e instanceof ErrorXxx) {
          res.status(e.errorXxx.code)
          return { details: e.errorXxx.details }
        } else {
          res.status(500)
          return e instanceof Error ? { name: e.name, message: e.message, stack: e.stack } : { error: String(e) }
        }
      })

    pendingReplyPromises.push(replyPromise)
    replyPromise.finally(() => pendingReplyPromises.splice(pendingReplyPromises.indexOf(replyPromise), 1))
    res.send(endpointless_domain_access.async ? void 0 : _serial(await replyPromise))
  })
  app.use(basePath, router)

  return new Promise<void>((resolve /* , reject */) => {
    app.listen(port, () => {
      console.log(`http receiver listening on port ${port}`)
      resolve()
    })
  }).then<httpBinderReceiverHandle>(() => {
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
function _serial(_: _any) {
  return _ === void 0 ? _VOID_VALUE_ : JSON.stringify(_, replacer)
}
function replacer(_key: string, val: _any) {
  return val === void 0 ? _VOID_VALUE_ : val
}
function reviver(_key: string, val: _any) {
  return val === _VOID_VALUE_ ? void 0 : val
}
