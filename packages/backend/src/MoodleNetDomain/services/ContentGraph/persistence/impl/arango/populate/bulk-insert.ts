import Axios, { AxiosError } from 'axios'
import { createReadStream, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { env, getDB } from '../ContentGraph.persistence.arango.env'
import { getGraph } from '../setupGraph'

export const dropGraphAndBulkInsertDir = async (path: string) => {
  const db = await getDB()
  const graph = await getGraph({ db })
  console.log('dropping graph...')
  await graph.drop(true)
  await getGraph({ db })

  return Promise.all(
    readdirSync(path)
      .sort()
      .reverse()

      .map(async base => {
        const [, collection] = base.split('_')
        if (!collection) {
          return
        }
        const filename = join(path, base)
        console.log(`insert ${filename} in ${collection}`)
        const stream = createReadStream(filename)
        const { size } = statSync(filename)
        return Axios.request({
          method: 'POST',
          url: `${env.url}/_db/${env.databaseName}/_api/import?type=documents&collection=${collection}`,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          data: stream,
          headers: {
            'Content-Length': size,
          },
        }).then(
          res => {
            console.log(`bulk insert ${collection} : ${res.status < 300 ? 'OK' : 'NOK'}`)
            res.status >= 300 && console.log(res.data)
            return res
          },
          e => {
            const err = e as AxiosError
            console.error({ status: err.response?.status, msg: err.message, data: err.response?.data })
          },
        )
      }),
  )
}
