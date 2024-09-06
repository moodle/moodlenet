import type { FC } from 'react'
import { AddToCollectionButton } from './AddToCollectionButtons.js'
import { useAddToCollectionButtons } from './AddToCollectionButtonsHook.js'

export const AddToCollectionButtonContainer: FC<{ resourceKey: string }> = ({ resourceKey }) => {
  const opt = useAddToCollectionButtons(resourceKey)
  return <AddToCollectionButton {...opt} />
}
