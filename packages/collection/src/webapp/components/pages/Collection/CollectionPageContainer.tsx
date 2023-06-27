import type { FC } from 'react'
import Collection from './Collection.js'
import { useCollectionPageProps } from './CollectionPageHooks.js'

export const CollectionContainer: FC<{ collectionKey: string; editMode: boolean }> = ({
  collectionKey,
  editMode,
}) => {
  const panelProps = useCollectionPageProps({ collectionKey })
  if (!panelProps) {
    return null
  }
  return <Collection key={collectionKey} {...panelProps} isEditing={editMode} />
}
