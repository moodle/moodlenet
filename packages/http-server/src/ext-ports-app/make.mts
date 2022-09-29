import { setApiCtxClientSession } from '@moodlenet/authentication-manager'
import { getPkgApisRefByPkgName, PkgName, useApis } from '@moodlenet/core'
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

    const pkgName = urlTokens.slice(0, isScopedPkgName ? 2 : 1).join('/') as PkgName

    // const pkgVersion = urlTokens[isScopedPkgName ? 2 : 1]! as PkgVersion
    // FIXME : Check version compat

    const path = urlTokens.slice(isScopedPkgName ? 3 : 2).join('/')
    const targetPkgApisRef = getPkgApisRefByPkgName(pkgName)
    if (!(targetPkgApisRef && path)) {
      return next()
    }
    const apiReqBody = req.body
    if (!isApiReqBody(apiReqBody)) {
      res.sendStatus(400)
      return
    }
    const apis = useApis(import.meta, targetPkgApisRef)
    const apiCtx = setApiCtxClientSession({ ctx: { primary: true }, token: req.moodlenet.authToken })
    const apiFn = apis(path, { ctx: apiCtx })
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
