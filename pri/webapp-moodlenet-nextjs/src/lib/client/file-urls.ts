import { prefixed_domain_file_paths } from '@moodle/mod-storage/lib'
import { useDeployments } from './globalContexts'

export function useDomainFileUrls() {
  const { filestoreHttp } = useDeployments()
  return prefixed_domain_file_paths(filestoreHttp.href)
}
