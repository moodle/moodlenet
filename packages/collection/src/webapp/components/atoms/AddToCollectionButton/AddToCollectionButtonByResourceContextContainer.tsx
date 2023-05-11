import type { FC } from 'react'
import { AddToCollectionButtonContainer } from './AddToCollectionButtonsContainer.js'

export const AddToCollectionButtonByResourceContextContainer: FC = () => {
  const { resourceKey } = { resourceKey: 'get from context' } // useContext(ResourceContext)
  return <AddToCollectionButtonContainer resourceKey={resourceKey} />
}
