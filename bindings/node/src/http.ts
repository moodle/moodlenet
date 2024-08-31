import { domain_msg, PrimarySession, reply } from '@moodle/domain'
import { _any, d_m, map } from '@moodle/lib/types'
import express from 'express'
import { Agent, fetch } from 'undici'

export interface LayerMeta {
  pri: PrimarySession
  // sec: SecondarySession
}

export interface TransportData<layer extends keyof LayerMeta> {
  layer: d_m<LayerMeta, 'layer'>[layer]
  domain_msg: domain_msg
}

export function client(agent_opts?: Agent.Options) {
  const dispatcher = new Agent({
    pipelining: 2,
    keepAliveMaxTimeout: 600e3, //default
    keepAliveTimeout: 4e3, //default
    keepAliveTimeoutThreshold: 1e3, //default
    ...agent_opts,
  })

  type req_target = {
    host: string
    port: number
    basePath: string
    secure: boolean
  }
  type req_opts = {
    headers: map<string, string>
  }
  return async function request<layer extends keyof LayerMeta>(
    transport_data: TransportData<layer>,
    req_target: string | req_target,
    _opts?: Partial<req_opts>,
  ) {
    const url =
      typeof req_target === 'string'
        ? new URL(req_target)
        : new URL(
            `${req_target.secure ? 'https' : 'http'}://${req_target.host}:${req_target.port}`,
            req_target.basePath,
          )

    const body = JSON.stringify(transport_data)
    const reply = await fetch(url, {
      method: 'POST',
      body,
      dispatcher,
      headers: { ..._opts?.headers, 'Content-Type': 'application/json' },
    }).then(r => r.json())

    return reply
  }
}

type srv_cfg<layer extends keyof LayerMeta> = {
  access: (_: TransportData<layer>) => Promise<reply<_any>>
  port: number
  baseUrl: string
}
export async function server<layer extends keyof LayerMeta>({
  access,
  port,
  baseUrl,
}: srv_cfg<layer>) {
  const app = express()
  app.use(express.json())
  app.post(baseUrl, async (req, res) => {
    const reply = await access(req.body)
    res.json(reply)
  })
  return new Promise<void>((resolve /* , reject */) => {
    app.listen(port, resolve)
  })
}
