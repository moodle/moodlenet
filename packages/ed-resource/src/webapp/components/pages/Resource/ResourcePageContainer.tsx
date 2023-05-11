import type { FC } from 'react'
import { ProvideCurrentResourceContext } from '../../../CurrentResourceContext.js'
import ResourcePage from './Resource.js'
import { useResourcePageProps } from './ResourcePageHooks.js'

export const ResourcePageContainer: FC<{ resourceKey: string }> = ({ resourceKey }) => {
  const panelProps = useResourcePageProps({ resourceKey })
  return (
    panelProps && (
      <ProvideCurrentResourceContext _key={resourceKey}>
        <ResourcePage {...panelProps} />
      </ProvideCurrentResourceContext>
    )
  )
}
