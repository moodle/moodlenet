import { setApiCtxClientSessionToken } from '@moodlenet/authentication-manager'
import { FloorApiCtx, pkgConnection } from '@moodlenet/core'
import express, { json } from 'express'
import { format } from 'util'
import { HttpApiResponse } from '../types.mjs'

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

    const pkgConn = await pkgConnection<any>(import.meta, { name: pkgName, version: pkgVersion })
    const apiReqBody = req.body
    if (!isApiReqBody(apiReqBody)) {
      res.sendStatus(400)
      return
    }
    // console.log({ mmm: req.moodlenet })
    const ctx: FloorApiCtx = { primary: true }
    setApiCtxClientSessionToken({ ctx, token: req.moodlenet.authToken })
    const apiFn = pkgConn.api(path, { ctx })
    const apiArgs = apiReqBody?.args ?? []
    apiFn(...apiArgs)
      .then(apiResponse => {
        const httpApiResponse: HttpApiResponse = {
          response: apiResponse,
        }
        res.header('Content-Type', 'application/json')
        res.status(200).send(httpApiResponse)
      })
      .catch(err => {
        console.error(err)
        res.status(500)
        res.end(err instanceof Error ? format(err) : err) //(JSON.stringify({ msg: {}, val: String(err) }))
      })
  })
  srvApp.all(`*`, (_, res) => res.status(404).send(`service not available`))
  return srvApp
}

type ApiReqBody = {
  args: any[]
}
function isApiReqBody(_: any): _ is ApiReqBody | undefined {
  return _ === void 0 || _.args === void 0 || Array.isArray(_.args)
}
