import {
  fileExceedsMaxUploadSize,
  isUploadType,
  UploadMaxSizes,
  UploadType,
} from '@moodlenet/common/dist/staticAsset/lib'
import { pick } from '@moodlenet/common/dist/utils/object'
import { Request } from 'express'
import { fromFile } from 'file-type'
import Formidable, { File } from 'formidable'
import { readFile } from 'fs/promises'
import { isText } from 'istextorbinary'

const _RespError = Symbol('RespError')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RespError = [errCode: number, msg: any, _: typeof _RespError]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const respError = (errCode: number, msg: any): RespError => [errCode, msg, _RespError]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRespError = (_: any): _ is RespError => Array.isArray(_) && _.length === 3 && _[2] === _RespError

type FileD = Pick<File, 'hash' | 'lastModifiedDate' | 'name' | 'path' | 'size' | 'type'>
// type FileWithHash = FileD& { hash: string }
type GetUploadFileResp = RespError | [FileD & { mimetype: string }, UploadType] //WithHash
export type Opts = { maxSizes: UploadMaxSizes }
export const getUploadedFile = (req: Request, opts: Opts) =>
  new Promise<GetUploadFileResp>(resolve => {
    Formidable({ multiples: false, allowEmptyFiles: false }).parse(req, async (err, fields, files) => {
      if (err) {
        return resolve(respError(400, `cannot accept files: ${String(err)}`))
      }

      const badReq = (msg: string): RespError => respError(400, msg)
      if (!(files && fields)) {
        return resolve(badReq(`post one file and a type`))
      }

      const mUploadType = fields.type
      if (!mUploadType) {
        return resolve(badReq('post a type'))
      }
      const uploadType = Array.isArray(mUploadType) ? mUploadType[0] : mUploadType
      if (!isUploadType(uploadType)) {
        return resolve(badReq(`unknown type ${uploadType}`))
      }

      const mFile = files.file
      if (!mFile) {
        return resolve(badReq(`post one file`))
      }
      const _file = Array.isArray(mFile) ? mFile[0] : mFile
      if (!_file) {
        return resolve(badReq(`post one file`))
      }
      const maxSize = opts.maxSizes[`${uploadType}MaxSize`]
      if (fileExceedsMaxUploadSize(_file.size, maxSize)) {
        return resolve(badReq(`file too large ${_file.size}, max size for ${uploadType} is ${maxSize}`))
      }
      const file = pick(_file, ['hash', 'lastModifiedDate', 'name', 'path', 'size', 'type'])
      // file.type : Formidable.File.type: string | null :: The mime type of this file, according to the uploading client.
      const firstFileCheck = await fromFile(file.path)
      const mimetype =
        firstFileCheck?.mime ?? isText(file.name, await readFile(file.path))
          ? file.type || 'text/plain'
          : file.type || `application/octet-stream`

      const fileWithMeta = { ...file, mimetype }

      resolve([fileWithMeta, uploadType]) //({ ...file, hash: file.hash! })
    })
  })
