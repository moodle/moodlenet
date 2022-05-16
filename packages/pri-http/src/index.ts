import * as K from '@moodlenet/kernel'
import { json } from 'body-parser'
// import * as xlib from 'express'
import express, { Application } from 'express'
import { Server } from 'http'

interface Instance {
  mount(_: { mountApp: Application; absMountPath?: string }): void
  express: typeof express
  // xlib: typeof xlib
}

export type MNPriHttpExt = K.ExtDef<'moodlenet.pri-http', '0.1.10', {}, void, Instance>

// const ext: K.Ext<MNPriHttpExt, [K.KernelExt, coreExt.sysLog.MoodlenetSysLogExt]> = {
const ext: K.Ext<MNPriHttpExt, [K.KernelExt]> = {
  id: 'moodlenet.pri-http@0.1.10',
  displayName: 'pri htth',
  requires: ['kernel.core@0.1.10'], //, 'moodlenet.sys-log@0.1.10'],
  enable(shell) {
    return {
      deploy(/* {  tearDown } */) {
        const logger = console
        // const logger = coreExt.sysLog.moodlenetSysLogLib(shell)
        const env = getEnv(shell.env)
        const app = express().use(`/`, (_, __, next) => next())

        let server: Server | undefined

        app.use(`/_`, makeExtPortsApp())
        // app.use(`/`, express.static(__dirname))

        // K.pubAll<MNPriHttpExt>('moodlenet.pri-http@0.1.10', shell, {
        //   setWebAppRootFolder: _shell => async p => {
        //     console.log({ p })
        //     const staticApp = express.static(p.folder)
        //     app.get(`/*`, staticApp)
        //     app.get(`/*`, (req, res, next) => staticApp(((req.url = '/'), req), res, next))
        //   },
        // })

        if (env.port) {
          restartServer(env.port)
        } else {
          logger.info(`No port defined in env, won't start HTTP server at startup`)
        }
        return {
          inst({ depl }) {
            return {
              mount({ mountApp, absMountPath }) {
                console.log('MOUNT', { absMountPath })
                const { extName /* , version */ } = K.splitExtId(depl.extId)
                const mountPath = absMountPath ?? `/_/${extName}`
                app.use(mountPath, mountApp)
              },
              express,
              // xlib,
            }
          },
        }

        async function stopServer() {
          return new Promise<void>((resolve, reject) => {
            if (!server) {
              return resolve()
            }
            logger.info(`Stopping HTTP server`)
            server.close(err => (err ? reject(err) : resolve()))
          })
        }
        async function restartServer(port: number) {
          await stopServer()
          return new Promise<void>((resolve, reject) => {
            logger.info(`Starting HTTP server on port ${port}`)
            server = app.listen(port, function () {
              arguments[0] ? reject(arguments[0]) : resolve()
            })
            logger.info(`HTTP listening on port ${port} :)`)
          })
        }
        function makeExtPortsApp() {
          const srvApp = express()
          srvApp.use(json())
          srvApp.post('*', async (req, res, next) => {
            /*
            gets ext name&ver 
            checks ext enabled and version match (kernel port)
            checks port is guarded
            pushes msg
            */

            const tokens = req.path.split('/').slice(1)
            const extId = tokens.slice(0, 2).join('@') as K.ExtId
            const path = tokens.slice(2).join('/') as K.TopoPath
            console.log('Exposed Api call', extId, path, req.path)
            if (!(extId && path)) {
              return next()
            }
            const pointer = K.joinPointer(extId, path)
            const extDeployment = shell.getExt(extId)
            console.log('Exposed Api pointer', { pointer, extDeployment: extDeployment?.extId })

            if (!(pointer && extDeployment)) {
              return next()
            }

            res.setHeader('Content-Type', 'application/stream+json')
            console.log('*********body', req.body)
            try {
              console.log(`http sub ${pointer}`)
              const apiSub = K.subDemat(shell)(pointer as never)(req.body, {
                primary: true,
              })
                // .pipe(take(4))
                .subscribe({
                  //K.ValValueOf<K.SubTopo<any, any>>
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
export default [ext]

type Env = {
  port: number
}
function getEnv(rawExtEnv: K.RawExtEnv): Env {
  console.log({ rawExtEnv })
  return rawExtEnv as any //FIXME: implement checks
}
