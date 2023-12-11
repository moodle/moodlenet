import tar from 'tar-stream'
import { createGunzip } from 'zlib'
import { streamToString } from './getCompactBuffer.mjs'
import type { FileExtractor } from './types.mjs'

const mbzExtractor: FileExtractor = async ({ readable }) => {
  try {
    const extract = tar.extract({ allowUnknownFormat: true })
    readable.pipe(createGunzip()).pipe(extract)

    for await (const entry of extract) {
      if (entry.header.name === 'moodle_backup.xml') {
        const moodle_backup_str = await streamToString(entry)
        return {
          text: moodle_backup_str,
          type: `Moodle course`,
          contentDesc: `moodle_backup.xml`,
        }
      } else {
        entry.resume()
      }
    }
    return null
  } catch {
    return null
  } finally {
    readable.destroy()
  }
}
export default mbzExtractor
