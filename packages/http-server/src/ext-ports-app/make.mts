import { RpcArgs } from '@moodlenet/core'
import express, { json, Request } from 'express'
import multer from 'multer'
import { format } from 'util'
import shell from '../shell.mjs'
import { HttpApiResponse as HttpRpcResponse } from '../types.mjs'

export function makeExtPortsApp() {
  const exposes = shell.getExposes()
  const srvApp = express()
  srvApp.use(json())
  exposes.forEach(({ expose, pkgId }) => {
    const pkgApp = express()
    srvApp.use(`/${pkgId.name}`, pkgApp)
    Object.entries(expose.rpc).forEach(([rpcRoute, rpcDefItem]) => {
      const multipartMW = multer()
      pkgApp.all(`/${rpcRoute}`, multipartMW.none(), async (req, res, next) => {
        if (!['get', 'post'].includes(req.method.toLowerCase())) {
          res.status(405).send('unsupported ${req.method} method for rpc')
          next()
        }

        let rpcArgs: RpcArgs

        try {
          rpcArgs = getRpcArgs(req)
        } catch (err) {
          res.status(400)
          res.send(err)
          return
        }

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

function getRpcArgs(req: Request): RpcArgs {
  const [body /* , _type */] = getRpcBody(req)
  const rpcArgs: RpcArgs = [body]
  return rpcArgs
}

function getRpcBody(req: Request): [body: any, contentType: 'json' | 'multipart' | 'none'] {
  const contentTypeHeader = req.headers['content-type']

  const type = !contentTypeHeader
    ? 'none'
    : /^application\/json/i.test(contentTypeHeader)
    ? 'json'
    : /^multipart\/form-data/i.test(contentTypeHeader)
    ? 'multipart'
    : undefined

  if (!type) {
    throw new Error(`Unsupported content-type: ${contentTypeHeader}`)
  }

  if ('get' === req.method.toLowerCase()) {
    return [undefined, type]
  }

  if (type === 'json') {
    return [req.body, type]
  }

  if (type === 'multipart') {
    return [JSON.parse(req.body['.']), type]
  }

  throw new Error('Unsupported contentType: ${contentTypeHeader}')
}
