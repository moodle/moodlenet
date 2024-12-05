import { readableToBuffer } from '@moodle/lib-nodejs-common'
import { getReadableLocalAsset } from '@moodle/lib-storage-local-fs'
import { extractionOutcome } from '@moodle/module/resource-extraction'
import tar from 'tar-stream'
import { createGunzip } from 'zlib'
import type { assetExtractor } from '../../types'

const mbzExtractor: assetExtractor<'local'> = async ({ asset }) => {
  const readable = await getReadableLocalAsset(asset)
  const gunzip = createGunzip()
  const extract = tar.extract({ allowUnknownFormat: true })
  return new Promise<extractionOutcome>((resolve, reject) => {
    ;[readable, gunzip, extract].forEach(stream => stream.on('error', reject))
    readable.pipe(gunzip).pipe(extract)
    ;(async () => {
      for await (const entry of extract) {
        if (entry.header.name === 'moodle_backup.xml') {
          const moodle_backup_str = (await readableToBuffer(entry)).toString('utf-8')
          resolve([
            true,
            {
              title: asset.name,
              content: moodle_backup_str,
              image: null,
              extractionKind: 'Moodle course backup file',
            },
          ])
        } else {
          entry.resume()
        }
      }
      resolve([false, { reason: 'couldNotExtract' }])
    })()
  })
    .catch<extractionOutcome>(error => {
      return [false, { reason: 'error', error }]
    })
    .finally(() => {
      ;[readable, gunzip, extract].forEach(stream => stream.destroy())
    })
}
export default mbzExtractor
