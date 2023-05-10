import type { FC } from 'react'
import { AddToCollectionButton } from './AddToCollectionButtons.js'
import { useAddToCollectionButtons } from './AddToCollectionButtonsHook.js'

export const CollectionContainer: FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const opt = useAddToCollectionButtons(collectionKey)
  return <AddToCollectionButton {...opt} />
}
