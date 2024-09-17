import { Error4xx, reply, status_code_4xx } from '@moodle/domain'
import { _any, map } from '@moodle/lib-types'
import express from 'express'
import { Agent, fetch } from 'undici'
import { TransportData } from '.'

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

    const body = JSON.stringify(transport_data)
    const reply = await fetch(url, {
      method: 'POST',
      body,
      dispatcher,
      headers: { ..._opts?.headers, 'Content-Type': 'application/json' },
    })
      .then(async response => {
        const is2xx = response.status >= 200 && response.status < 300
        const jsonBody: _any = await response.json()
        if (is2xx) {
          return jsonBody
        }
        const is4xx = response.status >= 400 && response.status < 500
        if (is4xx) {
          throw new Error4xx(response.status as status_code_4xx, jsonBody?.details ?? undefined)
        }
        throw new Error(`Server error: ${response.status}\n ${JSON.stringify(jsonBody, null, 2)}`)
      })
      .catch(e => {
        console.error(e)
        throw e
      })

    return reply
  }
}

export type requestHandler = (_: TransportData) => Promise<reply<_any>>

type srv_cfg = {
  request: requestHandler
  port: number
  baseUrl: string
}
export async function server({ request, port, baseUrl }: srv_cfg) {
  const app = express()
  app.use(express.json())
  app.post(baseUrl, async (req, res) => {
    const reply = await request(req.body)
      .catch(e => {
        console.error(e)
        throw e
      })
      .catch(e => {
        if (e instanceof Error4xx) {
          res.status(e.code)
          return { details: e.details }
        } else {
          res.status(500)
          return e instanceof Error
            ? { name: e.name, message: e.message, stack: e.stack }
            : { error: String(e) }
        }
      })
    res.json(reply)
  })
  return new Promise<void>((resolve /* , reject */) => {
    app.listen(port, resolve)
  })
}
