import { readableToBuffer } from '@moodle/lib-nodejs-common'
import { ingestionOutcome } from '@moodle/module/resource-ingestion'
import tar from 'tar-stream'
import { createGunzip } from 'zlib'
import type { assetIngestor } from '../../types'

const mbzIngestor: assetIngestor<'stored'> = async ({ asset }) => {
  const readable = await getReadableLocalAsset(asset)
  const gunzip = createGunzip()
  const ingest = tar.ingest({ allowUnknownFormat: true })
  return new Promise<ingestionOutcome>((resolve, reject) => {
    ;[readable, gunzip, ingest].forEach(stream => stream.on('error', reject))
    readable.pipe(gunzip).pipe(ingest)
    ;(async () => {
      for await (const entry of ingest) {
        if (entry.header.name === 'moodle_backup.xml') {
          const moodle_backup_str = (await readableToBuffer(entry)).toString('utf-8')
          resolve({
            outcome: 'succeed',
            result: [
              {
                title: asset.name,
                content: moodle_backup_str,
                image: null,
                ingestionKind: 'Moodle course backup file',
              },
            ],
          })
        } else {
          entry.resume()
        }
      }
      resolve({ outcome: 'failed', debug: 'moodle_backup.xml not found', reason: 'couldNotIngest' })
    })()
  })
    .catch<ingestionOutcome>(error => {
      return { outcome: 'failed', debug: error, reason: 'error' }
    })
    .finally(() => {
      ;[readable, gunzip, ingest].forEach(stream => stream.destroy())
    })
}
export default mbzIngestor
