import tar from 'tar-stream'
import { createGunzip } from 'zlib'
import { streamToBuffer } from '../../util.mjs'
import type { FileExtractor } from '../types.mjs'

const mbzExtractor: FileExtractor = async ({ readable, rpcFile: { name } }) => {
  try {
    const extract = tar.extract({ allowUnknownFormat: true })
    readable.pipe(createGunzip()).pipe(extract)

    for await (const entry of extract) {
      if (entry.header.name === 'moodle_backup.xml') {
        const moodle_backup_str = (await streamToBuffer(entry)).toString('utf-8')
        return {
          title: name,
          content: moodle_backup_str,
          type: `Moodle course`,
          contentDesc: `moodle_backup.xml`,
          provideImage: undefined,
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
