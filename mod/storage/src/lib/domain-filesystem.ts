import { moodle_domain, storage } from '@moodle/domain'
import { createPathProxy, path, url_path_string_schema } from '@moodle/lib-types'
import { join } from 'path'

export const [domain_file_path_arr] = createPathProxy<
  storage.fs<storage.filesystem, storage.fsPathGetter>
>({
  apply({ path }) {
    return [url_path_string_schema.parse(path.join('/')), path]
  },
})

export const [domain_file_path] = createPathProxy<
  storage.fs<storage.filesystem, storage.fsUrlPathGetter>
>({
  apply({ path }) {
    return url_path_string_schema.parse(path.join('/'))
  },
})

export async function domain_files_http_urls(primary: moodle_domain['primary']) {
  const { filestoreHttp } = await primary.env.application.deployments()
  return prefixed_domain_file_paths(filestoreHttp.href)
}
export function prefixed_domain_file_paths(prefix: path | string) {
  const _prefix = [prefix].flat()
  const [prefixed_domain_file_paths] = createPathProxy<
    storage.fs<storage.filesystem, storage.fsUrlPathGetter>
  >({
    apply({ path }) {
      const _path = [..._prefix, ...path].join('/')
      return url_path_string_schema.parse(_path)
    },
  })
  return prefixed_domain_file_paths
}

export function getFsDirectories({
  currentDomainDir,
}: {
  currentDomainDir: string
}): storage.fsDirectories {
  return {
    temp: join(currentDomainDir, '.temp'),
    fsStorage: join(currentDomainDir, 'fs-storage'),
  }
}

export const DEFAULT_DOMAINS_HOME_DIR_NAME = '.moodle.domains.home'
