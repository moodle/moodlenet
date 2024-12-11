import { readableToBuffer } from '@moodle/lib-nodejs-common'
import { ingestionOutcome } from '@moodle/module/resource-ingestion'
import tar from 'tar-stream'
import { createGunzip } from 'zlib'
import type { ingestor } from '../../types'

const mbzIngestor: ingestor<'readable'> = async ({ object }) => {
  const gunzip = createGunzip()
  const ingest = tar.extract({ allowUnknownFormat: true })
  return new Promise<ingestionOutcome>((resolve, reject) => {
    ;[object.readable, gunzip, ingest].forEach(stream => stream.on('error', reject))
    object.readable.pipe(gunzip).pipe(ingest)
    ;(async () => {
      for await (const entry of ingest) {
        if (entry.header.name === 'moodle_backup.xml') {
          const moodle_backup_str = (await readableToBuffer(entry)).toString('utf-8')
          resolve({
            outcome: 'succeed',
            title: object.name,
            content: moodle_backup_str,
            image: null,
            ingestionKind: 'Moodle course backup file',
          })
        } else {
          entry.resume()
        }
      }
      resolve({ outcome: 'failed', reason: 'moodle_backup.xml not found' })
    })()
  })
    .catch<ingestionOutcome>(error => {
      return { outcome: 'failed', debug: error, reason: 'error' }
    })
    .finally(() => {
      ;[object.readable, gunzip, ingest].forEach(stream => stream.destroy())
    })
}
export default mbzIngestor
