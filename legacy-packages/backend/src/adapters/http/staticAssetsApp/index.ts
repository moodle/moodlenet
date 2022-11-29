import { UploadMaxSizes } from '@moodlenet/common/dist/staticAsset/lib'
import express, { Response } from 'express'
import { createReadStream } from 'fs'
import { rm } from 'fs/promises'
import * as staticAsset from '../../../ports/static-assets'
import { TempFileDesc } from '../../../ports/static-assets/types'
import * as help from './helpers'

const sendErrorResponse = (res: Response, [status, err]: help.RespError) => res.status(status).send(err)

export type Config = {
  uploadMaxSizes: UploadMaxSizes
}
export const createStaticAssetsApp = ({ uploadMaxSizes }: Config) => {
  const app = express()

  app.post('/upload-temp', async (req, res) => {
    // this check could get more accurate (context assertions engine)
    if (!req.mnHttpContext.sessionEnv.authId) {
      return sendErrorResponse(res, help.respError(401, 'logged users only can upload'))
    }

    const upload = await help.getUploadedFile(req, { maxSizes: uploadMaxSizes })

    if (help.isRespError(upload)) {
      return sendErrorResponse(res, upload)
    }
    const [file, uploadType] = upload
    const uploadReadStream = createReadStream(file.path)
    const tempFileDesc: TempFileDesc = {
      name: file.name,
      mimetype: file.mimetype,
      size: file.size,
      lastModifiedDate: file.lastModifiedDate,
      uploadType,
    }

    const response = await staticAsset.temp
      .createTempAsset({ tempFileDesc, stream: uploadReadStream })
      .finally(() => rm(file.path, { force: true }).catch())

    if (typeof response === 'string') {
      return sendErrorResponse(res, help.respError(403, response))
    }

    return res.send(response.tempAssetId)
  })

  app.get('/*', async (req, res) => {
    const assetId = decodeURI(req.url.substr(1))
    // console.log({ assetId })
    const getResult = await staticAsset.asset.getAsset({ assetId })
    if (!getResult) {
      sendErrorResponse(res, help.respError(404, 'not found'))
      return
    }
    const [stream] = getResult
    stream.pipe(res)
  })

  return app
}
