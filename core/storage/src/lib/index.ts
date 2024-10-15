import { storage } from '@moodle/domain'
import { createPathProxy, path, url_path_string_schema } from '@moodle/lib-types'
import { createHash } from 'crypto'
import { createReadStream } from 'fs'
import { sep } from 'path'

export async function generateFileHashes(filePath: string): Promise<storage.fileHashes> {
  const sha256 = await new Promise<string>((resolve, reject) => {
    const hash = createHash('sha256')
    const rs = createReadStream(filePath)
    rs.on('error', reject)
    rs.on('data', chunk => hash.update(chunk))
    rs.on('end', () => resolve(hash.digest('hex')))
  })
  return {
    sha256,
  }
}

export function prefixed_domain_file_fs_paths(prefix: path | string) {
  const _prefix = [prefix].flat()
  const prefixed_domain_file_paths = createPathProxy<
    storage.fs<storage.filesystem, storage.fsUrlPathGetter>
  >({
    apply({ path }) {
      const _path = [..._prefix, ...path].join(sep)
      return url_path_string_schema.parse(_path)
    },
  })
  return prefixed_domain_file_paths
}
