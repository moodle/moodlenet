import type { FC } from 'react'
import { CollectionCard } from './CollectionCard.js'
import { useCollectionCardProps } from './CollectionCardHooks.js'

export const CollectionCardContainer: FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const opt = useCollectionCardProps(collectionKey)
  return opt && <CollectionCard {...opt} />
}
