import {
  getMaybeRpcFileReadable,
  getRpcStatusCode,
  isRpcStatusType,
  readableRpcFile,
  RpcArgs,
  RpcFile,
} from '@moodlenet/core'
import assert from 'assert'
import express, { json, Request } from 'express'
import { open } from 'fs/promises'
import multer, { Field } from 'multer'
import { Readable } from 'stream'
import { format } from 'util'
import { HttpRpcResponse } from '../../common/pub-lib.mjs'
import { httpContextMW } from '../lib.mjs'
import { shell } from '../shell.mjs'

export function makeExtPortsApp() {
  const exposes = shell.getExposes()
  const srvApp = express()
  srvApp.use(json())
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
          fileSize: rpcDefItem.bodyWithFiles?.maxFileSize,
        },
      })

      const multerMw = multerFields.length ? multipartMW.fields(multerFields) : multipartMW.none()

      pkgApp.all(`/${rpcRoute}`, multerMw, httpContextMW, async (httpReq, httpResp) => {
        if (!['get', 'post'].includes(httpReq.method.toLowerCase())) {
          httpResp.status(405).send('unsupported ${req.method} method for rpc')
          return
        }
        let rpcArgs: RpcArgs

        try {
          rpcArgs = getRpcArgs(httpReq)
        } catch (err) {
          console.log(err)
          httpResp.status(400)
          httpResp.send(err)
          return
        }

        try {
          rpcDefItem.guard(...rpcArgs)
        } catch (err) {
          console.log(err)
          httpResp.status(400)
          httpResp.send(err)
          return
        }

        await rpcDefItem
          .fn(...rpcArgs)
          .then(async rpcResponse => {
            const mReadable = await getMaybeRpcFileReadable(rpcResponse)
            const { rpcStatusCode: statusCode } = getRpcStatusCode() ?? { rpcStatusCode: 200 }
            httpResp.status(statusCode)
            if (mReadable) {
              const rpcFile: RpcFile = rpcResponse
              rpcFile.name && httpResp.header('x-rpc-file-name', `${rpcFile.name}`)
              rpcFile.size && httpResp.header('Content-Length', `${rpcFile.size}`)
              rpcFile.type && httpResp.header('Content-Type', `${rpcFile.type}`)
              mReadable.pipe(httpResp)
              return
            } else {
              httpResp.header('Content-Type', 'application/json')
              const httpRpcResponse: HttpRpcResponse = {
                response: rpcResponse,
              }
              httpResp.send(httpRpcResponse)
              return
            }
          })
          .catch(err => {
            console.log({ HTTP_RPC_ERROR: err })
            const { rpcStatusCode, payload } = isRpcStatusType(err)
              ? err
              : {
                  rpcStatusCode: 500,
                  payload: err instanceof Error ? format(err) : String(err),
                }
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

  const type = !contentTypeHeader
    ? 'none'
    : /^application\/json/i.test(contentTypeHeader)
    ? 'json'
    : /^multipart\/form-data/i.test(contentTypeHeader)
    ? 'multipart'
    : undefined

  if (!type) {
    throw new Error(`Unsupported content-type: ${contentTypeHeader}`)
  }

  if ('get' === req.method.toLowerCase()) {
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
      }, JSON.parse(req.body['.']))

    return [body, type]
  }

  throw new Error('Unsupported contentType: ${contentTypeHeader}')
}
