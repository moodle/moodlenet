import { domain_ctrl, isReplySuccess, reply, replyFail } from '@moodle/domain'
import assert from 'assert'
import express from 'express'
import { Agent, fetch } from 'undici'
import { factories } from '../types'

async function replyVal<_payload>(
  reply_p: reply<_payload> | Promise<reply<_payload>>,
): Promise<_payload> {
  return Promise.resolve(reply_p).then(reply =>
    isReplySuccess(reply) ? reply.body : Promise.reject(reply),
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
        const raw = fetch_response.then(r => r.json()) as Promise<reply<any>>
        const val = replyVal(raw)

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
          const msg = `NOT IMPLEMENTED ${String(accessArgs)}`
          //FIXME - log to a logger instead of console (would be a secondary ?) ... but maybe not here .. we're in a low level module here .. so console is fine .. but we should have a logger in the domain layer that we can use  .. and we should have a way to configure it .. and we should have a way to inject it .. and we should have a way to test it .. and we should have a way to mock it .. and we should have a way to trace it .. and we should have a way to monitor it .. and we should have a way to alert on it .. and we should have a way to throttle it .. and we should have a way to rate limit it .. and we should have a way to cache it .. and we should have a way to retry it .. and we should have a way to circuit break it .. and we should have a way to trace it .. and we should have a way to monitor it .. and we should have a way to alert on it .. and we should have a way to throttle it .. and we should have a way to rate limit it .. and we should have a way to cache it .. and we should have a way to retry it .. and we should have a way to circuit break it ..
          console.error(msg)
          throw new Error(msg)
        }
        return handler(msg_payload)
          .catch((err: unknown) => {
            return replyFail('500', err)
          })
          .then((reply: reply<any>) => res.json(reply))
      })
      return new Promise<void>((resolve /* , reject */) => {
        app.listen(port, resolve)
      })
    }
  },
}
export default factories
