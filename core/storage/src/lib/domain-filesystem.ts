import { MoodleDomain, storage } from '@moodle/domain'
import { createPathProxy, path, url_path_string_schema } from '@moodle/lib-types'

export const domain_file_path_arr = createPathProxy<
  storage.fs<storage.filesystem, storage.fsPathGetter>
>({
  apply({ path }) {
    return [url_path_string_schema.parse(path.join('/')), path]
  },
})

export const domain_file_path = createPathProxy<
  storage.fs<storage.filesystem, storage.fsUrlPathGetter>
>({
  apply({ path }) {
    return url_path_string_schema.parse(path.join('/'))
  },
})

export async function domain_files_http_urls(primary: MoodleDomain['primary']) {
  const { filestoreHttp } = await primary.env.application.deployments()
  return prefixed_domain_file_paths(filestoreHttp.href)
}
export function prefixed_domain_file_paths(prefix: path | string) {
  const _prefix = [prefix].flat()
  const prefixed_domain_file_paths = createPathProxy<
    storage.fs<storage.filesystem, storage.fsUrlPathGetter>
  >({
    apply({ path }) {
      const _path = [..._prefix, ...path].join('/')
      return url_path_string_schema.parse(_path)
    },
  })
  return prefixed_domain_file_paths
}
