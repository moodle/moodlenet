import type { FC } from 'react'
import { AddToCollectionButton } from './AddToCollectionButtons'
import { useAddToCollectionButtons } from './AddToCollectionButtonsHook'

export const AddToCollectionButtonContainer: FC<{ resourceKey: string }> = ({ resourceKey }) => {
  const opt = useAddToCollectionButtons(resourceKey)
  return <AddToCollectionButton {...opt} />
}
