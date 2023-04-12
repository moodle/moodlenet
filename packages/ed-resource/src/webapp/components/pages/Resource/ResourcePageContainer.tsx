import { FC } from 'react'
import ResourcePage from './Resource.js'
import { useResourcePageProps } from './ResourcePageHooks.js'

export const ResourcePageContainer: FC<{ resourceKey: string }> = ({ resourceKey }) => {
  const panelProps = useResourcePageProps({ resourceKey })
  return panelProps && <ResourcePage {...panelProps} />
}
