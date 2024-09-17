import type { FC } from 'react'
import { CollectionCard } from './CollectionCard'
import { useCollectionCardProps } from './CollectionCardHooks'

export const CollectionCardContainer: FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const opt = useCollectionCardProps(collectionKey)
  return opt && <CollectionCard {...opt} />
}
