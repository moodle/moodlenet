import express, { Request, Response } from 'express'
import Formidable, { File } from 'formidable'
import { createReadStream } from 'fs'
import { rm } from 'fs/promises'
import sharp from 'sharp'
import { Readable } from 'stream'
import { StaticAssetsIO } from './impl/types'
import { isUploadType, TempFileDesc, TempFileId } from './types'

interface HttpGatewayCfg {
  io: StaticAssetsIO
}

const sendErrorResponse = (res: Response, [status, err]: RespError) => res.status(status).send(err)

export const attachStaticAssetsHTTPGateway = ({ io }: HttpGatewayCfg) => {
  const app = express()
  app.post('/:type(icon|image|resource)', async (req, res) => {
    const procRes = await processUploadedFile(req, io)
    if (isRespError(procRes)) {
      sendErrorResponse(res, procRes)
      return
    }
    res.send(procRes)
  })

  app.get('/*', async (req, res) => {
    const assetId = decodeURI(req.url.substr(1))
    console.log({ assetId })
    const stream = await io.getAsset(assetId)
    if (!stream) {
      sendErrorResponse(res, respError(404, ''))
      return
    }
    stream.pipe(res)
  })

  return app
}

const processUploadedFile = async (req: Request, io: StaticAssetsIO) => {
  //TODO brakdown and import this fn
  const uploadType = req.params.type

  if (!isUploadType(uploadType)) {
    return respError(400, `unknown type ${uploadType}`)
  }
  const file = await getUploadedFile(req)

  if (isRespError(file)) {
    return file // err
  }

  const _cleanup = (a?: any) => (rm(file.path, { force: true }), a)
  const _createTemp = ({ tempFileDesc, stream }: { tempFileDesc: TempFileDesc; stream: Readable }) =>
    io
      .createTemp({ stream, tempFileDesc })
      .catch(err => respError(500, err))
      .finally(_cleanup)

  const originalUploadReadStream = createReadStream(file.path)
  const _splitname = !file.name ? null : file.name.split('.')
  const ext = (_splitname && _splitname.pop()) || null
  const originalBaseName = _splitname && _splitname.join('.')
  const tempFileDesc: TempFileDesc = {
    filename: {
      base: originalBaseName,
      ext,
    },
    size: file.size,
    mimetype: file.type,
    uploadType,
  }
  if (uploadType === 'resource') {
    return _createTemp({ tempFileDesc: tempFileDesc, stream: originalUploadReadStream })
  }

  return new Promise<RespError | TempFileId>(async resolve => {
    const imagePipeline = sharpImagePipeline[uploadType]()
    originalUploadReadStream.pipe(imagePipeline)
    imagePipeline.on('error', err => {
      _cleanup()
      resolve(respError(400, String(err)))
    })
    const jpgFileDesc: TempFileDesc = {
      ...tempFileDesc,
      mimetype: 'image/jpeg',
      filename: {
        ...tempFileDesc.filename,
        ext: 'jpg',
      },
    }
    const saveRes = await _createTemp({ tempFileDesc: jpgFileDesc, stream: imagePipeline })
    resolve(saveRes)
  })
}

const sharpImagePipeline = {
  icon: () => sharp({ sequentialRead: true }).resize(256, 256, { fit: 'inside' }).jpeg(),
  image: () => sharp({ sequentialRead: true }).resize(1600, null, { fit: 'cover', withoutEnlargement: true }).jpeg(),
}

type RespError = [errCode: number, msg: any, _: typeof _RespError]
const _RespError = Symbol('RespError')
const respError = (errCode: number, msg: any): RespError => [errCode, msg, _RespError]
const isRespError = (_: any): _ is RespError => Array.isArray(_) && _.length === 3 && _[2] === _RespError
// type FileWithHash = File & { hash: string }
type GetUploadFileResp = RespError | File //WithHash
const getUploadedFile = (req: Request) =>
  new Promise<GetUploadFileResp>(resolve => {
    //FIXME: this check could get more accurate (context assertions engine)
    if (req.mnHttpSessionCtx.type === 'anon') {
      return resolve(respError(401, 'logged users only can upload'))
    }
    new Formidable({ multiples: false /* , hash: 'md5' */ }).parse(req, (err, _fields, files) => {
      if (err) {
        return resolve(respError(400, `cannot accept files: ${String(err)}`))
      }

      const badReq = (): RespError => respError(400, `post one file`)
      if (!files) {
        return resolve(badReq())
      }
      const mFile = files.file
      if (!mFile) {
        return resolve(badReq())
      }
      const file = 'length' in mFile ? mFile[0] : mFile
      if (!file) {
        return resolve(badReq())
      }

      resolve(file) //({ ...file, hash: file.hash! })
    })
  })
