import { http_bind } from '@moodle/bindings-http'
import { gateProxy } from '@moodle/domain/lib'
import { generateUlid } from '@moodle/lib-id-gen'
import { createUploadedTempFile, deleteTempFile, fileMeta } from '@moodle/lib-temp-dir'
import { isMimetype, signed_token_schema, url_string_schema } from '@moodle/lib-types'
import assert from 'assert'
import cookieParser from 'cookie-parser'
import express from 'express'
import multer from 'multer'
import { userAgent } from 'next/server'
import { Headers } from 'undici'
const PORT = parseInt(process.env.MOODLE_FS_FILE_SERVER_PORT ?? '8010')
const BASE_HTTP_PATH = /* process.env.MOODLE_FS_FILE_SERVER_BASE_HTTP_PATH ?? */ '/.files'

const { data: MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL } = url_string_schema.safeParse(process.env.MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL) //?? 'http://localhost:8000'
assert(MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL, 'MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS not valid int in env')

const MOODLE_TEMP_DIR = process.env.MOODLE_TEMP_DIR
assert(MOODLE_TEMP_DIR, 'MOODLE_TEMP_DIR not found in env')

const MOODLE_BASE_ASSET_DIR = process.env.MOODLE_BASE_ASSET_DIR
assert(MOODLE_BASE_ASSET_DIR, 'MOODLE_BASE_ASSET_DIR not found in env')

const MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS = parseInt(process.env.MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS || 'N/A')
assert(MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS, 'MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS not valid int in env')

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      gateProxy: moo.gate.client.proxy<moo.Personas>
      requestClaims: moo.gate.provider.requestClaims
      requestURL: URL
    }
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Multer {
      export interface File {
        moodleUploaded: {
          tempId: string
          fileMeta: fileMeta
        }
      }
    }
  }
}

const app = express()
const gateDispatcher = http_bind.getHttpBinderDispatcher<moo.gate.provider.request>({ reqHttpTarget: MOODLE_FS_FILE_SERVER_PRIMARY_ENDPOINT_URL })

console.log('moodle-fs-file-server started')
app.use(cookieParser()).use(async (req, _res, next) => {
  const { requestClaims } = digestRequest(req)
  req.gateProxy = gateProxy({
    requestClaims,
    formDispatcher: gateProviderRequest => {
      return gateDispatcher([gateProviderRequest.path, gateProviderRequest])
    },
  })

  // const domainInfo = await ap.primary.env.domain.info()
  // console.log({ domainInfo, dirs: req.dirs })
  next()
})

const router = express
  .Router()
  .get(/\/\.temp\/\.*/, async (req, res, next) => {
    req.url = req.url.replace(/^\/\.temp\//, '')
    express.static(MOODLE_TEMP_DIR, {})(req, res, next)
  })
  .get(/\.*/, async (req, res) => {
    // const [module, ...path] = req.url.split('/')
    // if (!module) {
    //   return res.status(404).send('NOT FOUND')

    // req.moodlePrimary[module as keyof moodle_domain['primary']].fileServerQuery.canServe({ path })
    // const [canServe] = await (req.moodlePrimary as any_)[module].fileServerQuery.canServe({ path })

    // if (!canServe) {
    //   return res.status(401).send('UNAUTHORIZED')
    // }

    // req.url = dirname(req.url)

    // const localFsStorageDirectory = getDefaultLocalFsStorageDirectory({ domainFsDirectories: req.domainFsDirectories })
    express.static('      `localFsStorageDirectory`    ', {})(req, res, () => {
      res.status(404).send('NOT FOUND')
    })
  })
  .post('/.temp/:type', async (req, res) => {
    if (req.params.type !== 'file' && req.params.type !== 'webImage') {
      res.status(404).end()
    }
    const { permissionsInfo } = await req.gateProxy.any.system.access.session.myOwn()

    const limits = permissionsInfo.tree.authenticated?._.schemas.uploadSize
    const fileSizeLimit = req.params.type === 'file' ? limits?.file.max : limits?.image.max

    if (permissionsInfo.user.type !== 'auth' || !fileSizeLimit) {
      res.status(401).send('UNAUTHORIZED')
      return
    }

    const multerOptions: multer.Options = {
      limits: {
        fileSize: fileSizeLimit,
      },
      storage: {
        _handleFile(req, file, cb) {
          //sample file: {
          //   fieldname: 'file',
          //   originalname: 'filename.jpg',
          //   encoding: '7bit',
          //   mimetype: 'image/jpeg',
          //   destination: '/path/to/temp_dir',
          //   filename: '085dcd493a51adf9e34bdc776926e225',
          //   path: '/path/to/temp_dir/085dcd493a51adf9e34bdc776926e225',
          //   size: 129352
          // }
          if (!file || !isMimetype(file.mimetype)) {
            cb(new Error('upload failed'))
            return
          }
          if (!isMimetype(file.mimetype)) {
            cb(new Error(`invalid mimetype ${file.mimetype}`))
            return
          }
          createUploadedTempFile({
            expiresSeconds: MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS,
            tempDir: MOODLE_TEMP_DIR,
            readable: file.stream,
            uploadedFileMeta: {
              name: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              requestClaims: req.requestClaims,
              original: {
                name: file.originalname,
              },
              uploaded: {
                date: new Date().toISOString(),
                by: permissionsInfo.user,
              },
            },
          }).then(
            ({ uploadedFileMeta: fileMeta, tempId }) => {
              cb(null, { moodleUploaded: { fileMeta, tempId } })
            },
            e => {
              cb(e)
            },
          )
        },
        _removeFile(_req, file, callback) {
          deleteTempFile({
            tempDir: MOODLE_TEMP_DIR,
            tempId: file.moodleUploaded.tempId,
          }).then(() => callback(null), callback)
        },
      }, //get from req.moodlePrimary
    }
    multer({ dest: MOODLE_TEMP_DIR, ...multerOptions }).single('file')(req, res, async () => {
      if (!req.file?.moodleUploaded) {
        return res.status(500).send('upload failed')
      }
      res.status(200).json({ tempId: req.file.moodleUploaded.tempId })
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
// SHAREDLIB
// need to ingest lib (cookies, access-session ... ) for all http primaries
// check DEV-NOTES.md for more info
const AUTH_COOKIE = 'moodle-auth'

function digestRequest(req: express.Request) {
  const { headers, requestURL } = middlewareHeaders(req)
  // const xHost = headers.get('x-host')
  const { success, data: xHref } = url_string_schema.safeParse(headers.get('x-href')) // ?? req.originalUrl ?? req.url)
  assert(success, `invalid x-href in headers [${headers.get('x-href')}]`)
  // const xPort = headers.get('x-port')
  // const xProto = headers.get('x-proto') ?? 'http'
  // const xUrl = headers.get('x-url') ?? undefined
  // const xMode = headers.get('x-mode') ?? undefined
  const ua = userAgent({ headers: headers })
  // assert(xHost, 'x-host not found in headers')
  const requestClaims: moo.gate.provider.requestClaims = {
    server: {
      authSessionToken: getAuthTokenCookie(req).sessionToken,
      requestId: `file-server.${generateUlid({ onDate: new Date().toISOString() })}`,
      href: xHref,
      ua: ua.ua,
    },
  }
  req.requestClaims = requestClaims
  req.requestURL = requestURL
  return { requestClaims, headers, requestURL }
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
  // const urlPort = headers.get('X-Forwarded-Port') || `${PORT}`
  const urlPathname = request.path
  const urlProto = (headers.get('X-Forwarded-Proto') || request.protocol).toLowerCase()
  // const xUrl = request.url.toString()
  const userAgent = headers.get('user-agent')
  const requestURL = new URL(request.url, `${urlProto}://${urlHost}`)

  // const xMode = null // request.mode

  // const xSearch = Object.entries(request.query ?? {})
  //   .map(([k, v]) => `${k}=${v}`)
  //   .join('&')

  //! NOTE:  consider this https://www.npmjs.com/package/next-extra ! (or maybe others)
  // or simply implement some utility functins for accessing these  custom data in server-components|actions

  // xMode ? headers.set('x-mode', xMode) : headers.delete('x-mode')
  // headers.set('x-url', xUrl)
  headers.set('x-host', urlHost)
  // headers.set('x-proto', urlProto)
  // headers.set('x-port', urlPort)
  headers.set('x-pathname', urlPathname)
  // headers.set('x-search', xSearch)
  headers.set('x-href', requestURL.href)
  userAgent && headers.set('x-user-agent', userAgent)

  return { headers, requestURL }
}
