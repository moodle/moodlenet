import { CurrentResourceContext } from '@moodlenet/ed-resource/webapp'
import type { FC } from 'react'
import { useContext } from 'react'
import { AddToCollectionButtonContainer } from './AddToCollectionButtonsContainer.js'

export const AddToCollectionButtonByResourceContextContainer: FC = () => {
  const resourceKey = useContext(CurrentResourceContext).identifiers?.entityIdentifier._key
  if (!resourceKey) {
    return null
  }
  return <AddToCollectionButtonContainer resourceKey={resourceKey} />
}
