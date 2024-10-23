import { http_bind } from '@moodle/bindings-node'
import { MoodleDomain, primarySession } from '@moodle/domain'
import { createMoodleDomainProxy } from '@moodle/domain/lib'
import { generateUlid } from '@moodle/lib-id-gen'
import {
  fsDirectories,
  generateFileHashes,
  getFsDirectories,
  MOODLE_DEFAULT_HOME_DIR,
} from '@moodle/lib-local-fs-storage'
import { date_time_string, isMimetype, signed_token_schema } from '@moodle/lib-types'
import { uploaded_blob_meta } from '@moodle/module/storage'
import { getSanitizedFileName } from '@moodle/module/storage/lib'
import assert from 'assert'
import cookieParser from 'cookie-parser'
import express from 'express'
import { mkdir, writeFile } from 'fs/promises'
import multer from 'multer'
import { userAgent } from 'next/server'
import { join, resolve } from 'path'
import { Headers } from 'undici'
const PORT = parseInt(process.env.MOODLE_FS_FILE_SERVER_PORT ?? '8010')
const BASE_HTTP_PATH = process.env.MOODLE_FS_FILE_SERVER_BASE_HTTP_PATH ?? '/.files'

const MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL = process.env.MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL
const MOODLE_FS_FILE_SERVER_DOMAINS_HOME_DIR = resolve(process.cwd(), process.env.MOODLE_FS_FILE_SERVER_DOMAINS_HOME_DIR ?? MOODLE_DEFAULT_HOME_DIR)

const requestTarget = MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL ?? 'http://localhost:8000'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      moodlePrimary: MoodleDomain['primary']
      moodlePrimarySession: primarySession
      moodleDirs: fsDirectories
    }
  }
}

const app = express()
const trnspClient = http_bind.client()
console.log('!!! moodle-fs-file-server started !!!')
app.use(cookieParser()).use(async (req, _res, next) => {
  const primarySession = await getPrimarySession(req)
  const ap = createMoodleDomainProxy({
    ctrl({ domainMsg }) {
      return trnspClient(
        {
          ...domainMsg,
          primarySession,
        },
        requestTarget,
      )
    },
  })

  req.moodleDirs = getFsDirectories({
    domainName: primarySession.domain,
    homeDir: MOODLE_FS_FILE_SERVER_DOMAINS_HOME_DIR,
  })
  // const domainInfo = await ap.primary.env.domain.info()
  // console.log({ domainInfo, dirs: req.dirs })
  req.moodlePrimarySession = primarySession
  req.moodlePrimary = ap.primary
  next()
})

const router = express
  .Router()
  .get(/\/\.temp\/\.*/, async (req, res, next) => {
    req.url = req.url.replace(/^\/\.temp\//, '')
    express.static(req.moodleDirs.temp, {})(req, res, next)
  })
  .get(/\.*/, async (req, res) => {
    // const [module, ...path] = req.url.split('/')
    // if (!module) {
    //   return res.status(404).send('NOT FOUND')

    // req.moodlePrimary[module as keyof moodle_domain['primary']].fileServerQuery.canServe({ path })
    // const [canServe] = await (req.moodlePrimary as _any)[module].fileServerQuery.canServe({ path })

    // if (!canServe) {
    //   return res.status(401).send('UNAUTHORIZED')
    // }
    // USA ALIAS NAME METTI UPLOADED_BLOB_META NEL DB NDO SERVE CO I WATCH !

    // req.url = dirname(req.url)
    express.static(join(req.moodleDirs.fsStorage), {})(req, res, () => {
      res.status(404).send('NOT FOUND')
    })
  })
  .post('/.temp/:type', async (req, res) => {
    await mkdir(req.moodleDirs.temp, { recursive: true })

    if (req.params.type !== 'file' && req.params.type !== 'webImage') {
      res.status(404).end()
    }
    const { userSession } = await req.moodlePrimary.userAccount.session.getUserSession()
    if (userSession.type !== 'authenticated') {
      return res.status(401).send('UNAUTHORIZED')
    }
    const { uploadMaxSizeConfigs } = await req.moodlePrimary.storage.session.moduleInfo()
    const fileSizeLimit = req.params.type === 'file' ? uploadMaxSizeConfigs.max : uploadMaxSizeConfigs.webImage
    const multerOptions: multer.Options = {
      limits: {
        fileSize: fileSizeLimit,
      },
    } //get from req.moodlePrimary

    multer({ dest: req.moodleDirs.temp, ...multerOptions }).single('file')(req, res, async () => {
      if (!req.file) {
        return res.status(500).send('upload failed')
      }
      if (!isMimetype(req.file.mimetype)) {
        return res.status(500).send(`invalid mimetype ${req.file.mimetype}`)
      }

      const uploaded_blob_meta: uploaded_blob_meta = {
        hash: await generateFileHashes(req.file.path),
        name: getSanitizedFileName(req.file.originalname),
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploaded: {
          primarySessionId: req.moodlePrimarySession.id,
          byUserAccountId: userSession.user.id,
          date: date_time_string('now'),
        },
        original: {
          name: req.file.originalname,
        },
      }
      writeFile(`${req.file.path}.json`, JSON.stringify(uploaded_blob_meta), 'utf8')
      res.status(200).json({ tempId: req.file.filename })

      //req.file: {
      //   fieldname: 'file',
      //   originalname: 'jp.jpg',
      //   encoding: '7bit',
      //   mimetype: 'image/jpeg',
      //   destination: '/path/to/.moodle.env.home/localhost/fs-storage/.temp',
      //   filename: '085dcd493a51adf9e34bdc776926e225',
      //   path: '/path/to/.moodle.env.home/localhost/fs-storage/.temp/085dcd493a51adf9e34bdc776926e225',
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
// SHAREDLIB
// need to extract lib (cookies, access-session ... ) for all http primaries
// check DEV-NOTES.md for more info
const AUTH_COOKIE = 'moodle-auth'

async function getPrimarySession(req: express.Request) {
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
  const userSession: primarySession = {
    id: await generateUlid(),
    domain: xHost,
    token: getAuthTokenCookie(req).sessionToken,
    app: {
      name: 'filestoreHttp',
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
    platforms: {
      local: {
        type: 'nodeJs',
        version: process.version,
        //    env: process.env,
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
  return userSession
}
export function getAuthTokenCookie(req: express.Request) {
  const { success, data: token } = signed_token_schema.safeParse(req.cookies[AUTH_COOKIE])

  return { sessionToken: success ? token : null }
}

export function middlewareHeaders(request: express.Request) {
  const filteredHeaders = Object.entries(request.headers)
    .filter((entry): entry is [string, string | string[]] => !!entry[1])
    .map(([k, v]) => [k, (v ?? null) && [v].flat().join(',')])

  const headers = new Headers(filteredHeaders)

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
