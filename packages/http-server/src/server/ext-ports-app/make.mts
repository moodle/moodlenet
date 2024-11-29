import type { RpcArgs, RpcFile } from '@moodlenet/core'
import {
  getCurrentRpcStatusCode,
  getMaybeRpcFileReadable,
  instanceDomain,
  isRpcNext,
  isRpcStatusType,
  readableRpcFile,
} from '@moodlenet/core'
import assert from 'assert'
import type { Request } from 'express'
import express, { json } from 'express'
import { open } from 'fs/promises'
import type { Field } from 'multer'
import multer from 'multer'
import { Readable } from 'stream'
import { format } from 'util'
// import { HttpRpcResponse } from '../../common/pub-lib.mjs'
import { getMiddlewares } from '../lib.mjs'
import { shell } from '../shell.mjs'

export async function getMyRpcBaseUrl() {
  const { pkgId } = shell.assertCallInitiator()
  return `${instanceDomain}/.pkg/${pkgId.name}/`
}
export function makeExtPortsApp() {
  const exposes = shell.getExposes()
  const srvApp = express()
  srvApp.use(json({ strict: false, limit: '10kb' }))
  exposes.forEach(({ expose, pkgId }) => {
    const pkgApp = express()
    srvApp.use(`/${pkgId.name}`, pkgApp)
    Object.entries(expose.rpc).forEach(([rpcRoute, rpcDefItem]) => {
      const fileFieldsEntries = Object.entries(rpcDefItem.bodyWithFiles?.fields ?? {})
      const multerFields = fileFieldsEntries.map<Field>(([fieldName, _fieldDef]) => {
        const fieldDef: Omit<Field, 'name'> =
          'number' === typeof _fieldDef ? { maxCount: _fieldDef } : { maxCount: _fieldDef.maxCount }
        return {
          name: fieldName,
          ...fieldDef,
        }
      })
      const multipartMW = multer({
        limits: {
          files: multerFields.reduce((acc, { maxCount }) => acc + (maxCount ?? 0), 0),
          fileSize: rpcDefItem.bodyWithFiles?.maxSize ?? 0,
        },
      })

      const multerMw = multerFields.length ? multipartMW.fields(multerFields) : multipartMW.none()

      pkgApp.all(`/${rpcRoute}`, multerMw, ...getMiddlewares(), async (httpReq, httpResp, next) => {
        if (!['get', 'post', 'head'].includes(httpReq.method.toLowerCase())) {
          httpResp.status(405).send('unsupported ${req.method} method for rpc')
          return
        }
        const isHead = 'head' === httpReq.method.toLowerCase()
        let rpcArgs: RpcArgs

        try {
          rpcArgs = getRpcArgs(httpReq)
        } catch (err) {
          shell.log('info', err)
          httpResp.status(400)
          httpResp.send(err)
          return
        }

        try {
          await rpcDefItem.guard(...rpcArgs)
        } catch (err) {
          shell.log('info', err)
          httpResp.status(400)
          httpResp.send(err)
          return
        }
        await rpcDefItem
          .fn(...rpcArgs)
          .then(async _rpcResponse => {
            if (httpResp.headersSent) {
              return
            }
            const rpcResponse = await getRpcResponse(_rpcResponse)
            const { rpcStatusCode: statusCode } = getCurrentRpcStatusCode() ?? {
              rpcStatusCode: 200,
            }
            httpResp.status(statusCode)
            if (rpcResponse.type === 'stream') {
              if (rpcResponse.rpcFile) {
                const { rpcFile } = rpcResponse
                rpcFile.name && httpResp.header('x-rpc-file-name', `${rpcFile.name}`)
                rpcFile.size && httpResp.header('Content-Length', `${rpcFile.size}`)
                rpcFile.type && httpResp.contentType(`${rpcFile.type}`)
              }
              if (isHead) {
                return httpResp.end()
              }
              rpcResponse.stream.pipe(httpResp)
              return
            } else {
              httpResp.contentType('application/json')
              if (isHead) {
                return httpResp.end()
              }
              httpResp.json(rpcResponse.json)
              return
            }
          })
          .catch(err => {
            if (isRpcNext(err)) {
              return next()
            }
            const { rpcStatusCode, payload } = isRpcStatusType(err)
              ? err
              : {
                  rpcStatusCode: 500,
                  payload: err,
                }
            shell.log(
              `error`,
              httpReq.path,
              err instanceof Error ? format(err) : String(err),
              err instanceof Error ? err.stack : '',
            )
            httpResp.status(rpcStatusCode).send(payload)
          })
        return srvApp
      })
    })
  })
  return srvApp
}

function getRpcArgs(req: Request): RpcArgs {
  const [body /* , contentType */] = getRpcBody(req)
  const rpcArgs: RpcArgs = [body, req.params, req.query]
  return rpcArgs
}

function getRpcBody(req: Request): [body: any, contentType: 'json' | 'multipart' | 'none'] {
  const contentTypeHeader = req.headers['content-type']
  // shell.log('debug', { HHH: req.headers })
  const type = !contentTypeHeader
    ? 'none'
    : /^application\/json/i.test(contentTypeHeader)
    ? 'json'
    : /^multipart\/form-data/i.test(contentTypeHeader)
    ? 'multipart'
    : undefined

  if (!type) {
    throw new TypeError(`Unsupported content-type: ${contentTypeHeader}`)
  }

  if (['get', 'head'].includes(req.method.toLowerCase())) {
    return [undefined, type]
  }

  if (type === 'json') {
    return [req.body, type]
  }

  if (type === 'multipart') {
    assert(!Array.isArray(req.files), `Multer passed req.files as array !! shouldn't ever happen !`)
    const multerFilesMap = req.files ?? {}
    const files = Object.keys(multerFilesMap).reduce((acc, propPath) => {
      const fieldFileArray = multerFilesMap[propPath]
      assert(
        fieldFileArray,
        `Shouldn't happen: fieldFileArray should be an array, not a ${fieldFileArray}`,
      )
      const rpcFiles = fieldFileArray.map(multerFile => {
        return readableRpcFile(
          {
            type: multerFile.mimetype,
            name: multerFile.originalname,
            size: multerFile.size,
          },
          async function getReadable() {
            if (multerFile.path) {
              const fd = await open(multerFile.path, 'r')
              const readable = fd.createReadStream({ autoClose: true })
              return readable
            } else {
              return Readable.from(multerFile.buffer)
            }
          },
        )
      })
      return {
        ...acc,
        [propPath]: rpcFiles,
      }
    }, {} as Record<string, RpcFile[]>)

    const body = Object.keys(files)
      .filter(fileFullPropName => fileFullPropName.startsWith('.'))
      .filter(fileFullPropName => fileFullPropName !== '.')
      .reduce((acc, filesPropPath) => {
        const propPath = filesPropPath.split('.').slice(1)
        const bodyAcc = { ...acc }

        propPath.reduce((filePropAcc, currPropName, index) => {
          // const isNumberProp = !isNaN(Number(currPropName))
          const isLast = index === propPath.length - 1
          if (isLast) {
            filePropAcc[currPropName] = files[filesPropPath]
          }
          return filePropAcc[currPropName]
          /*           if (isLast) {
            filePropAcc[currPropName] = files[filesPropPath]
          } else {
            filePropAcc[currPropName] = filePropAcc[currPropName] ?? isNumberProp ? [] : {}
          } */
        }, bodyAcc)

        return bodyAcc
      }, JSON.parse(req.body['.'] ?? '{}'))

    return [body, type]
  }

  throw new TypeError(`Unsupported contentType: ${contentTypeHeader}`)
}

async function getRpcResponse(rpcResponse: any) {
  const mReadable = await getMaybeRpcFileReadable(rpcResponse)
  if (mReadable) {
    return { type: 'stream', stream: mReadable, rpcFile: rpcResponse as RpcFile } as const
  } else if (rpcResponse instanceof Readable) {
    return { type: 'stream', stream: rpcResponse } as const
  } else {
    return { type: 'json', json: rpcResponse } as const
  }
}
