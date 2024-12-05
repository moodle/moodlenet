import { assertRpcFileReadable } from '@moodlenet/core'
import tar from 'tar-stream'
import { createGunzip } from 'zlib'
import type { resourceExtractionMetadata } from '../../types'
import { streamToBuffer } from '../../util'
import type { FileExtractor } from '../types'

const mbzExtractor: FileExtractor = async ({ rpcFile }) => {
  const readable = await assertRpcFileReadable(rpcFile)
  const gunzip = createGunzip()
  const extract = tar.extract({ allowUnknownFormat: true })
  return new Promise<resourceExtractionMetadata | null>((resolve, reject) => {
    ;[readable, gunzip, extract].forEach(stream => stream.on('error', reject))
    readable.pipe(gunzip).pipe(extract)
    ;(async () => {
      for await (const entry of extract) {
        if (entry.header.name === 'moodle_backup.xml') {
          const moodle_backup_str = (await streamToBuffer(entry)).toString('utf-8')
          resolve({
            title: rpcFile.name,
            content: moodle_backup_str,
            type: `Moodle course`,
            contentDesc: `moodle_backup.xml`,
            provideImage: undefined,
          })
        } else {
          entry.resume()
        }
      }
      resolve(null)
    })()
  })
    .catch(() => {
      return null
    })
    .finally(() => {
      ;[readable, gunzip, extract].forEach(stream => stream.destroy())
    })
}
export default mbzExtractor
