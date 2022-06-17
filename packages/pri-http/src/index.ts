import type * as Core from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import type { ReactAppExt } from '@moodlenet/react-app'
import { json } from 'body-parser'
import { resolve } from 'path'
import { PriHttpSubUrlPrefix } from './types'
export * from './types'

export type MNPriHttpExt = Core.ExtDef<'moodlenet-pri-http', '0.1.10'>

const mountSubUrl: PriHttpSubUrlPrefix = '/_/sub'
// const ext: Core.Ext<MNPriHttpExt, [Core.CoreExt, coreExt.sysLog.MoodlenetSysLogExt]> = {
const ext: Core.Ext<MNPriHttpExt, [Core.CoreExt, MNHttpServerExt]> = {
  id: 'moodlenet-pri-http@0.1.10',
  displayName: 'pri http',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.http-server@0.1.10'], //, 'moodlenet.sys-log@0.1.10'],
  enable(shell) {
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      inst.ensureExtension({
        moduleLoc: resolve(__dirname, 'webapp'),
      })
    })
    return {
      deploy(/* {  tearDown } */) {
        shell.onExtInstance<MNHttpServerExt>('moodlenet.http-server@0.1.10', httpServerInst => {
          httpServerInst.mount({ absMountPath: mountSubUrl, mountApp: makeExtPortsApp(httpServerInst) })
        })
        return {}

        function makeExtPortsApp(httpServerInst: Core.ExtInst<MNHttpServerExt>) {
          const srvApp = httpServerInst.express()
          srvApp.use(json())
          srvApp.post('*', async (req, res, next) => {
            /*
            gets ext name&ver 
            checks ext enabled and version match (core port)
            checks port is guarded
            pushes msg
            */

            const tokens = req.path.split('/').slice(1)
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
                .subDemat(shell)(pointer as never)(req.body, {
                  primary: true,
                })
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
          srvApp.all(`*`, (_, res) => res.status(404).send('service not available'))
          return srvApp
        }
      },
    }
  },
}
export default { exts: [ext] }
