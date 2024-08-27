import assert from 'assert'
import express from 'express'
import { Agent, fetch } from 'undici'
import { factories } from '../types'
import { access_status, ctrl } from '@moodle/core/domain'
import { statusKo } from 'core/domain/src/domain/access-status'

// function assert(t: any, msg: string): void {
//   if (!t) {
//     throw new Error(msg)
//   }
// }

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
      return (...access) => {
        const body = JSON.stringify([priSession, ...access])
        const fetch_response = fetch(new URL(url), { method: 'POST', body, dispatcher })

        const raw = fetch_response.then(r => r.json()) as Promise<access_status<any>>
        const val = raw.then(_raw => {
          return _raw.ok ? _raw.body : Promise.reject(_raw)
        })

        return { raw, val }
      }
    }
  },

  async ctrl(cfg) {
    return async accessCtrl => {
      // const express_mod = await import('express')
      // const express = express_mod.default

      const [port_str, baseUrl = '/'] = cfg.split('|')
      const port = parseInt(port_str)
      assert(port, 'port must be a number')
      const app = express()
      app.post(baseUrl, express.json(), async (req, res) => {
        const [priSession, mod_name, ch_name, msg_name, msg_payload] = req.body

        const controller = (await accessCtrl(priSession)) as ctrl
        const handler = controller[mod_name]?.[ch_name]?.[msg_name]
        if (!handler) {
          throw new Error('NOT IMPLEMENTED')
        }
        return handler(msg_payload)
          .catch((err: unknown) => {
            return statusKo('500', err)
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
