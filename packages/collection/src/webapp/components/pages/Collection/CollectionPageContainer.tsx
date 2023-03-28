import { FC } from 'react'
import Collection from './Collection.js'
import { useCollectionPageProps } from './CollectionPageHooks.js'

export const CollectionContainer: FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const panelProps = useCollectionPageProps({ collectionKey })

  return panelProps ? <Collection {...panelProps} /> : <h2>Data not load</h2>
}
