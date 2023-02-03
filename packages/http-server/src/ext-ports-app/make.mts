import { RpcArgs } from '@moodlenet/core'
import express, { json } from 'express'
import { format } from 'util'
import shell from '../shell.mjs'
import { HttpApiResponse as HttpRpcResponse } from '../types.mjs'

// getPkgApisRefByPkgName

export function makeExtPortsApp() {
  const exposes = shell.getExposes()
  const srvApp = express()
  srvApp.use(json())
  exposes.forEach(({ expose, pkgId }) => {
    const pkgApp = express()
    srvApp.use(`/${pkgId.name}`, pkgApp)
    Object.entries(expose.rpc).forEach(([rpcRoute, rpcDefItem]) => {
      pkgApp.all(`/${rpcRoute}`, async (req, res, next) => {
        if (!['get', 'post'].includes(req.method.toLowerCase())) {
          next()
        }
        const body = 'get' === req.method.toLowerCase() ? undefined : req.body
        const rpcArgs: RpcArgs = [body]
        try {
          rpcDefItem.guard(...rpcArgs)
        } catch (err) {
          res.status(400)
          res.send(err)
          return
        }

        await rpcDefItem
          .fn(...rpcArgs)
          .then(response => {
            res.header('Content-Type', 'application/json')
            const httpRpcResponse: HttpRpcResponse = {
              response,
            }
            res.status(200).send(httpRpcResponse)
          })
          .catch(err => {
            // console.log(err)
            res.status(500)
            res.send(err instanceof Error ? format(err) : String(err)) //(JSON.stringify({ msg: {}, val: String(err) }))
          })
      })
      return srvApp
    })
  })
  return srvApp
}
