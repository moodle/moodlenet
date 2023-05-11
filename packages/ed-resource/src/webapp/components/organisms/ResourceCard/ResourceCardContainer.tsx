import type { FC } from 'react'
import ResourceCard from './ResourceCard.js'
import { useResourceCardProps } from './ResourceCardHook.js'

export const ResourceCardContainer: FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const opt = useResourceCardProps(collectionKey)
  return opt && <ResourceCard {...opt} />
}
