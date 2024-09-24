import { errorXxx, ErrorXxx, isCodeXxx, status_code_xxx, TransportData } from '@moodle/lib-ddd'
import { _any, map } from '@moodle/lib-types'
import express from 'express'
import { Agent, fetch } from 'undici'

export function client(agent_opts?: Agent.Options) {
  const dispatcher = new Agent({
    pipelining: 2,
    keepAliveMaxTimeout: 600e3, //default
    keepAliveTimeout: 4e3, //default
    keepAliveTimeoutThreshold: 1e3, //default
    ...agent_opts,
  })

  type req_http_target = {
    host: string
    port: number
    basePath: string
    secure: boolean
  }
  type req_opts = {
    headers: map<string, string>
  }
  return async function request(
    transport_data: TransportData,
    req_http_target: string | req_http_target,
    _opts?: Partial<req_opts>,
  ) {
    const url =
      typeof req_http_target === 'string'
        ? new URL(req_http_target)
        : new URL(
            `${req_http_target.secure ? 'https' : 'http'}://${req_http_target.host}:${req_http_target.port}`,
            req_http_target.basePath,
          )

    const body = _serial(transport_data)
    const reply = await fetch(url, {
      method: 'POST',
      body,
      dispatcher,
      headers: { ..._opts?.headers, 'Content-Type': PROTOCOL_CONTENT_TYPE },
    })
      .then(async response => {
        const is2xx = response.status >= 200 && response.status < 300
        const jsonBodyStrUtf8 = await response.text()
        if (is2xx) {
          const jsonBody = _parse(jsonBodyStrUtf8)
          return jsonBody
        }
        if (isCodeXxx(response.status)) {
          const jsonBody = _parse(jsonBodyStrUtf8)
          throw new ErrorXxx(
            errorXxx(response.status as status_code_xxx, jsonBody?.details ?? undefined),
          )
        }
        throw new Error(`Server error: ${response.status}\n ${jsonBodyStrUtf8}`)
      })
      .catch(e => {
        console.error(e)
        throw e
      })

    return reply
  }
}

export type requestHandler = (_: TransportData) => Promise<_any>

type srv_cfg = {
  request: requestHandler
  port: number
  baseUrl: string
}
export async function server({ request, port, baseUrl }: srv_cfg) {
  const app = express()
  app.use(express.text({ defaultCharset: 'utf-8' }))
  app.post(baseUrl, async (req, res) => {
    res.setHeader('Content-Type', PROTOCOL_CONTENT_TYPE)
    const transportData = _parse(req.body)
    const reply = await request(transportData)
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
          return e instanceof Error
            ? { name: e.name, message: e.message, stack: e.stack }
            : { error: String(e) }
        }
      })
    const replyStr = _serial(reply)
    res.send(replyStr)
  })
  return new Promise<void>((resolve /* , reject */) => {
    app.listen(port, resolve)
  })
}

const PROTOCOL_CONTENT_TYPE = 'text/plain; charset=utf-8'
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
