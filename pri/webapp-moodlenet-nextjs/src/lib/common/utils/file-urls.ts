import { storage } from '@moodle/domain'
import { useContext } from 'react'
import { GlobalCtx } from '../../../app/root-layout.client'

export function useDomainFileUrls() {
  const {
    deployments: { filestoreHttp },
  } = useContext(GlobalCtx)
  return storage.prefixed_domain_file_paths(filestoreHttp.href)
}
