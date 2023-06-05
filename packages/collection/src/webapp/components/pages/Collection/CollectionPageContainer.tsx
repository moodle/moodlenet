import type { FC } from 'react'
import Collection from './Collection.js'
import { useCollectionPageProps } from './CollectionPageHooks.js'

export const CollectionContainer: FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const panelProps = useCollectionPageProps({ collectionKey })

  return panelProps ? <Collection key={collectionKey} {...panelProps} /> : null
}
