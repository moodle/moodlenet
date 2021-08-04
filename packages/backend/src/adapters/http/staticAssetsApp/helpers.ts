import { isUploadType, UploadType } from '@moodlenet/common/lib/staticAsset/lib'
import { Request } from 'express'
import Formidable, { File } from 'formidable'

export type RespError = [errCode: number, msg: any, _: typeof _RespError]
const _RespError = Symbol('RespError')
export const respError = (errCode: number, msg: any): RespError => [errCode, msg, _RespError]
export const isRespError = (_: any): _ is RespError => Array.isArray(_) && _.length === 3 && _[2] === _RespError

// type FileWithHash = File & { hash: string }
type GetUploadFileResp = RespError | [File, UploadType] //WithHash
export const getUploadedFile = (req: Request) =>
  new Promise<GetUploadFileResp>(resolve => {
    new Formidable({ multiples: false /* , hash: 'md5' */ }).parse(req, (err, fields, files) => {
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
      const file = Array.isArray(mFile) ? mFile[0] : mFile
      if (!file) {
        return resolve(badReq(`post one file`))
      }

      // FIXME: extract mimetype server side
      // https://www.npmjs.com/package/file-type
      // const FileType = require('file-type');
      // const fileMime= await FileType.fromFile(file.path)
      // >>>> fileMime : {ext: 'png', mime: 'image/png'}

      resolve([file, uploadType]) //({ ...file, hash: file.hash! })
    })
  })
