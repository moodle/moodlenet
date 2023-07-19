import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { ProvideCurrentResourceContext } from '../../../CurrentResourceContext.js'
import ResourcePage from './Resource.js'
import { useResourcePageProps } from './ResourcePageHooks.js'

export const ResourcePageContainer: FC<{ resourceKey: string; editMode: boolean }> = ({
  resourceKey,
  editMode,
}) => {
  const panelProps = useResourcePageProps({ resourceKey })
  if (panelProps === null) {
    return <FallbackContainer />
  } else if (panelProps === undefined) {
    return null
  }

  return (
    <ProvideCurrentResourceContext _key={resourceKey} key={resourceKey}>
      <ResourcePage {...panelProps} key={resourceKey} isEditingAtStart={editMode} />
    </ProvideCurrentResourceContext>
  )
}
