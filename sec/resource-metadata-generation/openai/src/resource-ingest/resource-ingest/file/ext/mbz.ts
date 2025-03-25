import { assertRpcFileReadable } from '@moodlenet/core'
import tar from 'tar-stream'
import { createGunzip } from 'zlib'
import type { resourceIngestionMetadata } from '../../types'
import { streamToBuffer } from '../../util'
import type { FileIngestor } from '../types'

const mbzIngestor: FileIngestor = async ({ rpcFile }) => {
  const readable = await assertRpcFileReadable(rpcFile)
  const gunzip = createGunzip()
  const ingest = tar.ingest({ allowUnknownFormat: true })
  return new Promise<resourceIngestionMetadata | null>((resolve, reject) => {
    ;[readable, gunzip, ingest].forEach(stream => stream.on('error', reject))
    readable.pipe(gunzip).pipe(ingest)
    ;(async () => {
      for await (const entry of ingest) {
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
      ;[readable, gunzip, ingest].forEach(stream => stream.destroy())
    })
}
export default mbzIngestor
