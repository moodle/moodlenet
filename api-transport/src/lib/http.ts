import { moodle_domain, sessionAccess } from '@moodle/domain'
import { factories } from '../types'

function assert(t: any, msg: string): void {
  if (!t) {
    throw new Error(msg)
  }
}

const factories: factories = {
  async sessionAccess(cfg) {
    const { fetch, Agent } = await import('undici')
    // const { fetch, Agent } = {
    //   async fetch(...args: any[]): Promise<any> {},
    //   Agent(...args: any[]) {},
    // }
    const [url] = cfg.split('|')
    assert(url, 'url must be a string')

    const dispatcher = new Agent({
      pipelining: 2,
      keepAliveMaxTimeout: 600e3, //default
      keepAliveTimeout: 4e3, //default
      keepAliveTimeoutThreshold: 1e3, //default
    })
    const sessionAccess: sessionAccess<moodle_domain> = async priSession => {
      return async (...access) => {
        const body = JSON.stringify([priSession, ...access])
        const response = await fetch(new URL(url), { method: 'POST', body, dispatcher })

        const [ok, reply_payload] = (await response.json()) as any
        if (!ok) {
          throw new Error(reply_payload)
        }
        return reply_payload
      }
    }

    return sessionAccess
  },

  async ctrl(cfg) {
    return async accessCtrl => {
      const express_mod = await import('express')
      const express = express_mod.default

      const [port_str, baseUrl = '/'] = cfg.split('|')
      const port = parseInt(port_str)
      assert(port, 'port must be a number')
      const app = express()
      app.post(baseUrl, express.json(), async (req, res) => {
        const [priSession, mod_name, ch_name, msg_name, msg_payload] = req.body

        const controller = (await accessCtrl(priSession)) as any
        const handler = controller[mod_name]?.[ch_name]?.[msg_name]
        if (!handler) {
          throw new Error('NOT IMPLEMENTED')
        }
        return handler(msg_payload)
          .then((reply_payload: unknown) => {
            res.json([true, reply_payload])
          })
          .catch((err: unknown) => {
            res.json([false, err])
          })
      })
      return new Promise<void>((resolve /* , reject */) => {
        app.listen(port, resolve)
      })
    }
  },
}
export default factories
