import Axios, { AxiosError } from 'axios'
import { createReadStream, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { sequencePromiseCalls } from '../../../../../../lib/helpers/misc'
import { env, getDB } from '../ContentGraph.persistence.arango.env'
import { getGraph } from '../setupGraph'
import { GEN_DIR } from './env'

getDB().then(async db => {
  const graph = await getGraph({ db })
  console.log('dropping graph...')
  await graph.drop(true)
  await getGraph({ db })

  console.log(`
    from ${GEN_DIR} ...
  `)
  const thunks = readdirSync(GEN_DIR)
    .filter(base => !!base.split('_')[1])
    .map(base => {
      const [, collection] = base.split('_')
      const filename = join(GEN_DIR, base)
      return { filename, base, collection }
    })
    .map(_ => {
      const { size } = statSync(_.filename)
      return { ..._, size }
    })
    .sort((a, b) => b.size - a.size)
    .map(({ filename, base, collection, size }) => {
      return () => {
        const stream = createReadStream(filename)
        console.log(`\n-insert ${base} in ${collection} [${(size / 1024 / 1024).toFixed(1)}MB]`)
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
            return err
          },
        )
      }
    })
  return sequencePromiseCalls(thunks).then(_ => {
    console.log('done')
  })
})
