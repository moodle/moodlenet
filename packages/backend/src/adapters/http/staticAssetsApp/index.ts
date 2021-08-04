import express, { Response } from 'express'
import { createReadStream } from 'fs'
import { rm } from 'fs/promises'
import { QMino } from '../../../lib/qmino'
import { get } from '../../../ports/static-assets/asset'
import { createTemp } from '../../../ports/static-assets/temp'
import { TempFileDesc } from '../../../ports/static-assets/types'
import * as help from './helpers'

const sendErrorResponse = (res: Response, [status, err]: help.RespError) => res.status(status).send(err)

export type Config = {
  qmino: QMino
}
export const createStaticAssetsApp = ({ qmino }: Config) => {
  const app = express()
  app.post('/upload-temp', async (req, res) => {
    // this check could get more accurate (context assertions engine)
    if (req.mnHttpSessionEnv) {
      return sendErrorResponse(res, help.respError(401, 'logged users only can upload'))
    }

    const upload = await help.getUploadedFile(req)

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

    const response = await qmino
      .callSync(createTemp({ tempFileDesc, stream: uploadReadStream }), { timeout: 5000 })
      .finally(() => rm(file.path, { force: true }).catch())

    if (typeof response === 'string') {
      return sendErrorResponse(res, help.respError(403, response))
    }

    return res.send(response.tempAssetId)
  })

  app.get('/*', async (req, res) => {
    const assetId = decodeURI(req.url.substr(1))
    // console.log({ assetId })
    const getResult = await qmino.query(get({ assetId }), { timeout: 5000 })
    if (!getResult) {
      sendErrorResponse(res, help.respError(404, 'not found'))
      return
    }
    const [stream] = getResult
    stream.pipe(res)
  })

  return app
}
