import { storage } from '@moodle/domain'
import { useDeployments } from './globalContexts'

export function useDomainFileUrls() {
  const { filestoreHttp } = useDeployments()
  return storage.prefixed_domain_file_paths(filestoreHttp.href)
}
