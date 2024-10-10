import { http_bind } from '@moodle/bindings-node'
import { moodle_domain } from '@moodle/domain'
import { access_session, create_access_proxy } from '@moodle/lib-ddd'
import {
  isMimetype,
  _any,
  date_time_string,
  signed_token_schema,
  temp_blob_meta,
} from '@moodle/lib-types'
import assert from 'assert'
import cookieParser from 'cookie-parser'
import express from 'express'
import { writeFile } from 'fs/promises'
import multer from 'multer'
import { userAgent } from 'next/server'
import { join } from 'path'
import { Headers } from 'undici'

const PORT = parseInt(process.env.MOODLE_FS_FILE_SERVER_PORT ?? '8010')
const BASE_HTTP_PATH = process.env.MOODLE_FS_FILE_SERVER_BASE_HTTP_PATH ?? '/.files'

const MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL =
  process.env.MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL
const MOODLE_FS_FILE_SERVER_APP_NAME =
  process.env.MOODLE_FS_FILE_SERVER_APP_NAME ?? 'moodle-fs-file-server'

const requestTarget = MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL ?? 'http://localhost:8000'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      moodlePrimary: moodle_domain['primary']
      accessSession: access_session
    }
  }
}

const app = express()
const trnspClient = http_bind.client()
console.log('!!! moodle-fs-file-server started !!!')
app.use(cookieParser()).use((req, _res, next) => {
  const accessSession = getAccessSession(req)
  const [ap] = create_access_proxy<moodle_domain>({
    sendDomainMsg({ domain_msg }) {
      return trnspClient(
        {
          domain_msg,
          access_session: accessSession,
          // core_mod_id: null,
        },
        requestTarget,
      )
    },
  })
  req.accessSession = accessSession
  req.moodlePrimary = ap.primary

  next()
})

const router = express.Router()
// function getPaths(req: express.Request) {
//   const host = req.headers['x-host']
//   assert(typeof host === 'string', `x-host not found as string in headers ${host}`)
//   const normalized_domain = host.replace(/:/g, '_') //SHAREDLIB: equals default configurator ( need shared libs !! )
//   const tempDirpath = join(MOODLE_FS_FILE_SERVER_BASE_FS_PATH, normalized_domain, '.temp') //SHAREDLIB: equals fs-storage secondary
// }
router

  .get(/\/\.temp\/\.*/, async (req, res, next) => {
    // console.log({ 'get .temp': req.url })
    req.url = req.url.replace(/^\/\.temp\//, '')
    const dirs = await req.moodlePrimary.env.application.fsHomeDirs()
    express.static(dirs.temp, {})(req, res, next)
  })
  .get(/\.*/, async (req, res) => {
    // console.log({ 'get': req.url })
    const dirs = await req.moodlePrimary.env.application.fsHomeDirs()
    // const [module, ...path] = req.url.split('/')
    // if (!module) {
    //   return res.status(404).send('NOT FOUND')
    // }

    // console.log({ get: { module, path } })
    // req.moodlePrimary[module as keyof moodle_domain['primary']].fileServerQuery.canServe({ path })
    // const [canServe] = await (req.moodlePrimary as _any)[module].fileServerQuery.canServe({ path })
    // console.log({ canServe: { canServe, module, path } })
    // if (!canServe) {
    //   return res.status(401).send('UNAUTHORIZED')
    // }
    express.static(join(dirs.domain, 'modules'), {})(req, res, () => {
      res.status(404).send('NOT FOUND')
    })
  })
  .post('/.temp', async (req, res) => {
    // console.log('req', inspect(req, { colors: true, depth: 2 }))
    const { userSession } = await req.moodlePrimary.iam.session.getCurrentUserSession()
    if (userSession.type !== 'authenticated') {
      return res.status(401).send('UNAUTHORIZED')
    }
    const dirs = await req.moodlePrimary.env.application.fsHomeDirs()
    const multerOptions: multer.Options = {} //get from req.moodlePrimary

    console.log({ dirs })
    multer({ dest: dirs.temp, ...multerOptions }).single('file')(req, res, () => {
      if (!req.file) {
        return res.status(500).send('upload failed')
      }
      if (!isMimetype(req.file.mimetype)) {
        return res.status(500).send(`invalid mimetype ${req.file.mimetype}`)
      }

      const temp_blob_meta: temp_blob_meta = {
        userSession,
        originalFilename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        created: date_time_string('now'),
      }
      writeFile(`${req.file.path}.json`, JSON.stringify(temp_blob_meta), 'utf8')
      res.status(200).json({ tempId: req.file.filename })
      // console.log(inspect(req.file, { colors: true, depth: 4 }))
      //req.file: {
      //   fieldname: 'file',
      //   originalname: 'jp.jpg',
      //   encoding: '7bit',
      //   mimetype: 'image/jpeg',
      //   destination: '/home/alec/MOODLENET/repo/mn-fork/.moodle.env.home/localhost/fs-storage/.temp',
      //   filename: '085dcd493a51adf9e34bdc776926e225',
      //   path: '/home/alec/MOODLENET/repo/mn-fork/.moodle.env.home/localhost/fs-storage/.temp/085dcd493a51adf9e34bdc776926e225',
      //   size: 129352
      // }
    })
  })
app.use(BASE_HTTP_PATH, router)

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} ${BASE_HTTP_PATH}`)
})

//
//
//
//
// FIXME: all this stuff below taken and adapted from nextjs server code
// need to extract lib (cookies, access-session ... ) for all http primaries
// check DEV-NOTES.md for more info
const AUTH_COOKIE = 'moodle-auth'

function getAccessSession(req: express.Request) {
  const { headers } = middlewareHeaders(req)
  const xHost = headers.get('x-host')
  // const xPort = headers.get('x-port')
  const xProto = headers.get('x-proto') ?? 'http'
  const xClientIp = headers.get('x-client-ip') ?? undefined
  const xUrl = headers.get('x-url') ?? undefined
  const xMode = headers.get('x-mode') ?? undefined
  const xGeo = JSON.parse(headers.get('x-geo') ?? '{}')
  const ua = userAgent({ headers: headers })
  assert(xHost, 'x-host not found in headers')
  const accessSession: access_session = {
    type: 'user',
    sessionToken: getAuthTokenCookie(req).sessionToken,
    app: {
      name: MOODLE_FS_FILE_SERVER_APP_NAME,
      pkg: 'webapp-moodlenet-nextjs',
      version: '0.1',
    },
    protocol: {
      type: 'http',
      secure: xProto === 'https',
      mode: xMode,
      url: xUrl,
      clientIp: xClientIp,
      ua: {
        name: ua.ua,
        isBot: ua.isBot,
      },
    },
    domain: xHost,
    platforms: {
      local: {
        type: 'nodeJs',
        version: process.version,
        env: process.env,
      },
      remote: {
        type: 'browser',
        version: ua.browser.version,
        name: ua.browser.name,
        geo: xGeo,
        cpu: ua.cpu,
        device: ua.device,
        engine: ua.engine,
        os: ua.os,
      },
    },
  }
  return accessSession
}
export function getAuthTokenCookie(req: express.Request) {
  // console.log('cookies', inspect(req.cookies, { colors: true, depth: 2 }))
  const { success, data: token } = signed_token_schema.safeParse(req.cookies[AUTH_COOKIE])

  return { sessionToken: success ? token : null }
}

export function middlewareHeaders(request: express.Request) {
  const filteredHeaders = Object.entries(request.headers)
    .filter((entry): entry is [string, string | string[]] => !!entry[1])
    .map(([k, v]) => [k, (v ?? null) && [v].flat().join(',')])

  const headers = new Headers(filteredHeaders)
  // console.log(inspect(request, { colors: true, depth: 2 }))
  const urlHost = headers.get('X-Forwarded-Host') || request.hostname
  const urlPort = headers.get('X-Forwarded-Port') || `${PORT}`
  const urlPathname = request.path
  const urlProto = (headers.get('X-Forwarded-Proto') || request.protocol).toLowerCase()
  const xUrl = request.url.toString()
  const xClientIp = headers.get('X-Forwarded-For') || request.ip || 'unknown'

  // FIXME: find how to get 'mode' and 'geo' in expressjs
  const xMode = null // request.mode
  const xGeo = JSON.stringify(/* request.geo */ null || {})

  const xSearch = Object.entries(request.query ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join('&')

  //! NOTE:  consider this https://www.npmjs.com/package/next-extra ! (or maybe others)
  // or simply implement some utility functins for accessing these  custom data in server-components|actions

  xMode ? headers.set('x-mode', xMode) : headers.delete('x-mode')
  headers.set('x-geo', xGeo)
  headers.set('x-url', xUrl)
  headers.set('x-client-ip', xClientIp)
  headers.set('x-host', urlHost)
  headers.set('x-proto', urlProto)
  headers.set('x-port', urlPort)
  headers.set('x-pathname', urlPathname)
  headers.set('x-search', xSearch)
  return { headers }
}
