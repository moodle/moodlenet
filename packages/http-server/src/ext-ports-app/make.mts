import express, { json } from 'express'
import { format } from 'util'
import { HttpApiResponse as HttpRpcResponse } from '../types.mjs'
import shell from '../shell.mjs'

// getPkgApisRefByPkgName

export function makeExtPortsApp() {
  const srvApp = express()
  srvApp.use(json())
  // srvApp.post(`${BASE_APIS_URL}/*`, async (req, res, next) => {
  srvApp.post(`/*`, async (req, res, next) => {
    // console.log({ url: req.url })
    /*
    gets ext name&ver 
    checks ext enabled and version match (core port)
    checks port is guarded
    pushes msg
    */

    const urlTokens = req.path.split('/').slice(1)
    if (urlTokens.length < 2) {
      return next()
    }
    const isScopedPkgName = urlTokens[0]?.[0] === '@'
    const path = urlTokens.slice(isScopedPkgName ? 3 : 2).join('/')
    const pkgName = urlTokens.slice(0, isScopedPkgName ? 2 : 1).join('/')
    const pkgVersion = urlTokens[isScopedPkgName ? 2 : 1]

    if (!(path && pkgName && pkgVersion)) {
      return next()
    }

    const rpcDefItem = shell.getExposedByPkgIdValue({ name: pkgName, version: pkgVersion })?.expose
      .rpc[path]
    if (!rpcDefItem) {
      res.sendStatus(400)
      return
    }

    res.header('Content-Type', 'application/json')

    const rpcArgs = [req.body] as const
    try {
      rpcDefItem.guard(...rpcArgs)
    } catch (err) {
      res.status(400)
      res.json({ error: err })
      return
    }

    rpcDefItem
      .fn(...rpcArgs)
      .then(response => {
        const httpRpcResponse: HttpRpcResponse = {
          response,
        }
        res.status(200).send(httpRpcResponse)
      })
      .catch(err => {
        console.error(err)
        res.status(500)
        res.end({ error: err instanceof Error ? format(err) : err }) //(JSON.stringify({ msg: {}, val: String(err) }))
      })
  })
  srvApp.all(`*`, (_, res) => res.status(404).send(`service not available`))
  return srvApp
}
