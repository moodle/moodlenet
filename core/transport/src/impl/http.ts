import assert from 'assert'
import express from 'express'
import { Agent, fetch } from 'undici'
import { factories } from '../types'
import { access_status, isStatusOk, statusFail, domain_ctrl } from '@moodle/core/domain'

// function assert(t: any, msg: string): void {
//   if (!t) {
//     throw new Error(msg)
//   }
// }
async function accessStatusVal<p>(
  status_p: access_status<p> | Promise<access_status<p>>,
): Promise<p> {
  return Promise.resolve(status_p).then(status =>
    isStatusOk(status)
      ? status.body
      : (() => {
          throw status
        })(),
  )
}
const factories: factories = {
  async sessionAccess(cfg) {
    const [url] = cfg.split('|')
    assert(url, 'url must be a string')

    const dispatcher = new Agent({
      pipelining: 2,
      keepAliveMaxTimeout: 600e3, //default
      keepAliveTimeout: 4e3, //default
      keepAliveTimeoutThreshold: 1e3, //default
    })

    return async priSession => {
      return (...accessArgs) => {
        const body = JSON.stringify([priSession, ...accessArgs])
        const fetch_response = fetch(new URL(url), {
          method: 'POST',
          body,
          dispatcher,
          headers: { 'Content-Type': 'application/json' },
        })
        const raw = fetch_response.then(r => r.json()) as Promise<access_status<any>>
        const val = accessStatusVal(raw)

        return { raw, val }
      }
    }
  },

  async ctrl(cfg) {
    return async accessCtrl => {
      // const express_mod = await import('express')
      // const express = express_mod.default

      const [port_str, baseUrl = ''] = cfg.split('|')
      const port = parseInt(port_str)
      assert(port, 'port must be a number')
      const app = express()
      app.use(express.json())
      app.post(baseUrl, async (req, res) => {
        const [priSession, ...accessArgs] = req.body
        const [mod_name, ch_name, msg_name, msg_payload] = accessArgs

        const controller = (await accessCtrl(priSession)) as domain_ctrl
        const handler = controller[mod_name]?.[ch_name]?.[msg_name]

        if (!handler) {
          console.log({ accessCtrl, accessArgs, controller })
          throw new Error('NOT IMPLEMENTED')
        }
        return handler(msg_payload)
          .catch((err: unknown) => {
            return statusFail('500', err)
          })
          .then((access_status: access_status<any>) => res.json(access_status))
      })
      return new Promise<void>((resolve /* , reject */) => {
        app.listen(port, resolve)
      })
    }
  },
}
export default factories


