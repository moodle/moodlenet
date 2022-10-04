import type * as Core from '@moodlenet/core'
import { json } from 'body-parser'
import express from 'express'
import { format } from 'util'
import type { MNHttpServerExt } from '.'
import { MN_HTTP_PRI_SUB_LIMIT_HEADER, RawSubPriMsgSubUrl } from './types'

export function makeExtPortsApp(shell: Core.ExtShell<MNHttpServerExt>) {
  const [, authSrv] = shell.deps
  const srvApp = express()
  srvApp.use(json())
  const rawSubPriMsgSubUrl: RawSubPriMsgSubUrl = 'raw-sub'
  srvApp.post(`/${rawSubPriMsgSubUrl}/*`, async (req, res, next) => {
    /*
    gets ext name&ver 
    checks ext enabled and version match (core port)
    checks port is guarded
    pushes msg
    */

    const urlTokens = req.path.split('/').slice(2)
    if (urlTokens.length < 2) {
      return next()
    }
    const isScopedPkgName = urlTokens[0]?.[0] === '@'

    const extName = urlTokens.slice(0, isScopedPkgName ? 2 : 1).join('/') as Core.ExtName
    const extVersion = urlTokens[isScopedPkgName ? 2 : 1]! as Core.ExtVersion
    const extId = `${extName}@${extVersion}` as Core.ExtId
    const path = urlTokens.slice(isScopedPkgName ? 3 : 2).join('/') as Core.TopoPath
    if (!(extId && path)) {
      return next()
    }
    const pointer = shell.lib.joinPointer(extId, path)
    const extDeployment = shell.getExt(extId)

    if (!(pointer && extDeployment)) {
      return next()
    }

    const limitHeader = req.headers[MN_HTTP_PRI_SUB_LIMIT_HEADER]
    const takeLimit = limitHeader && typeof limitHeader === 'string' ? Math.floor(Number(limitHeader)) : Infinity
    res.setHeader('content-type', 'application/stream+json')
    try {
      const apiSub = shell.lib
        .sub(shell._raw)(pointer as never)(req.body, {
          primary: true,
          context: req.moodlenet.authToken
            ? await authSrv.plug.makeMsgClientSessionContext({ authToken: req.moodlenet.authToken })
            : {},
        })
        .pipe(
          shell.rx.take(takeLimit),
          shell.rx.map(notif => {
            if (notif.msg.data.value.kind === 'E') {
              throw notif.msg.data.value.error
            }
            return notif
          }),
        )
        // .subDemat(shell)(pointer as never)(req.body, {
        //   primary: true,
        // })
        // .pipe(take(4))
        .subscribe({
          //Core.ValValueOf<Core.SubTopo<any, any>>
          next({ msg }) {
            res.cork()
            const msgNotif = msg.data.value

            res.write(JSON.stringify({ ...msgNotif, hasValue: undefined }) + '\n', () => res.uncork())
          },
          error(err) {
            res.status(500)
            res.end(err instanceof Error ? format(err) : err) //(JSON.stringify({ msg: {}, val: String(err) }))
          },
          complete() {
            res.status(200).end()
          },
        })
      res.on('close', () => {
        // curl works , postman nope
        apiSub.unsubscribe()
      })
    } catch (err) {
      console.error(err)
      res.status(500).send(String(err))
    }
  })
  srvApp.all(`*`, (_, res) =>
    res.status(404).send(`service not available ... ${_.url}::${_.baseUrl}::${_.originalUrl}`),
  )
  return srvApp
}
