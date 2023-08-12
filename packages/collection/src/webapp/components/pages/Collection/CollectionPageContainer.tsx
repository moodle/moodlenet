import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import Collection from './Collection.js'
import { useCollectionPageProps } from './CollectionPageHooks.js'

export const CollectionContainer: FC<{ collectionKey: string; editMode: boolean }> = ({
  collectionKey,
  editMode,
}) => {
  const collectionProps = useCollectionPageProps({ collectionKey })
  if (collectionProps === null) {
    return <FallbackContainer />
  } else if (collectionProps === undefined) {
    return null
  }
  return <Collection key={collectionKey} {...collectionProps} isEditingAtStart={editMode} />
}
