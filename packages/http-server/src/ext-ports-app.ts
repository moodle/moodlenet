import type * as Core from '@moodlenet/core'
import { json } from 'body-parser'
import express from 'express'
import { MNHttpServerExt } from '.'
import { RawSubPriMsgSubUrl } from './types'

export function makeExtPortsApp(shell: Core.Shell<MNHttpServerExt>) {
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

    const tokens = req.path.split('/').slice(2)
    const extId = tokens.slice(0, 2).join('@') as Core.ExtId
    const path = tokens.slice(2).join('/') as Core.TopoPath
    console.log('Exposed Api call', extId, path, req.path)
    if (!(extId && path)) {
      return next()
    }
    const pointer = shell.lib.joinPointer(extId, path)
    const extDeployment = shell.getExt(extId)
    console.log('Exposed Api pointer', { pointer, extDeployment: extDeployment?.extId })

    if (!(pointer && extDeployment)) {
      return next()
    }

    res.setHeader('Content-Type', 'application/stream+json')
    console.log('*********body', req.body)
    try {
      console.log(`http sub ${pointer}`)
      const apiSub = shell.lib
        .sub(shell)(pointer as never)(req.body, {
          primary: true,
        })
        // .subDemat(shell)(pointer as never)(req.body, {
        //   primary: true,
        // })
        // .pipe(take(4))
        .subscribe({
          //Core.ValValueOf<Core.SubTopo<any, any>>
          next({ msg }) {
            console.log('HTTP', { parMsgId: msg.parentMsgId, val: msg.data })
            res.cork()
            res.write(JSON.stringify({ msg }) + '\n')
            process.nextTick(() => res.uncork())
          },
          error(err) {
            console.log('HTTP err', { err })
            res.status(500)
            res.end(String(err)) //(JSON.stringify({ msg: {}, val: String(err) }))
          },
          complete() {
            console.log('HTTP complete')
            res.status(200).end()
          },
        })
      res.on('close', () => {
        // curl works , postman nope
        console.log('HTTP RESPONSE CLOSED **********************************************', apiSub.closed)
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
