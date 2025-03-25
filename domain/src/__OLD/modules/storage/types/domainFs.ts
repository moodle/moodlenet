import { createPathProxy, dirPaths, filePaths } from '@moodle/lib-types'


export interface DomainFilesystem {
  _?: never
}

const domain_fs_paths = createPathProxy<filePaths<DomainFilesystem> & dirPaths<DomainFilesystem>>({
  apply({ path }) {
    return path
  },
})
export const domainFs = {
  file: domain_fs_paths as filePaths<DomainFilesystem>,
  dir: domain_fs_paths as dirPaths<DomainFilesystem>,
}
