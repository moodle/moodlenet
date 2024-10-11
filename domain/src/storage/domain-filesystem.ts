import { createPathProxy, path, url_path_string, url_path_string_schema } from '@moodle/lib-types'
import { join } from 'path'
import { moodle_domain } from '..'
import { filesystem } from './types'

type filetype = 'image'

type fsPathGetter = () => path
type fsUrlPathGetter = () => url_path_string
type fs<_fs, getterType> = {
  [fsId in keyof _fs]: getterType &
    (_fs[fsId] extends filetype ? _fs[fsId] : fs<_fs[fsId], getterType>)
}

export const [domain_file_path_arr] = createPathProxy<fs<filesystem, fsPathGetter>>({
  apply({ path }) {
    return [url_path_string_schema.parse(path.join('/')), path]
  },
})

export const [domain_file_path] = createPathProxy<fs<filesystem, fsUrlPathGetter>>({
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
  const [prefixed_domain_file_paths] = createPathProxy<fs<filesystem, fsUrlPathGetter>>({
    apply({ path }) {
      const _path = [..._prefix, ...path].join('/')
      return url_path_string_schema.parse(_path)
    },
  })
  return prefixed_domain_file_paths
}

export type fsDirectories = {
  temp: string
  fsStorage: string
}
export function getFsDirectories({
  currentDomainDir,
}: {
  currentDomainDir: string
}): fsDirectories {
  return {
    temp: join(currentDomainDir, '.temp'),
    fsStorage: join(currentDomainDir, 'fs-storage'),
  }
}

export const DEFAULT_DOMAINS_HOME_DIR_NAME = '.moodle.domains.home'
