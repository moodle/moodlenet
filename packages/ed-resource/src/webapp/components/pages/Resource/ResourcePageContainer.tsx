import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { ProvideCurrentResourceContext } from '../../../CurrentResourceContext.js'
import ResourcePage from './Resource.js'
import { useResourcePageProps } from './ResourcePageHooks.js'

export const ResourcePageContainer: FC<{ resourceKey: string; editMode: boolean }> = ({
  resourceKey,
  editMode,
}) => {
  const resourceProps = useResourcePageProps({ resourceKey })
  if (resourceProps === null) {
    return <FallbackContainer />
  } else if (resourceProps === undefined) {
    return null
  }

  return (
    <ProvideCurrentResourceContext
      _key={resourceKey}
      key={resourceKey}
      resourceProps={resourceProps}
    >
      <ResourcePage {...resourceProps} key={resourceKey} isEditingAtStart={editMode} />
    </ProvideCurrentResourceContext>
  )
}
