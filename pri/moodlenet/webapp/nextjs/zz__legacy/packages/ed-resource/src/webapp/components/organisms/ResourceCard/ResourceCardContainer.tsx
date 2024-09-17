import type { FC } from 'react'
import ResourceCard from './ResourceCard'
import { useResourceCardProps } from './ResourceCardHook'

export const ResourceCardContainer: FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const opt = useResourceCardProps(collectionKey)
  return opt && <ResourceCard {...opt} />
}
