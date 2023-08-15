import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { ProvideCurrentResourceContext } from '../../../CurrentResourceContext.js'
import ResourcePage from './Resource.js'
import { useResourcePageProps } from './ResourcePageHooks.js'

export const ResourcePageContainer: FC<{ resourceKey: string }> = ({ resourceKey }) => {
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
      <ResourcePage {...resourceProps} key={resourceKey} />
    </ProvideCurrentResourceContext>
  )
}
