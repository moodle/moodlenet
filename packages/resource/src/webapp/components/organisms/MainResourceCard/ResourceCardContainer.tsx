import { FC } from 'react'
import MainResourceCard from './MainResourceCard.js'
import { useResourceCardProps } from './ResourceCardHook.js'

export const ResourceCardContainer: FC<{ resourceKey: string }> = ({ resourceKey }) => {
  const panelProps = useResourceCardProps({ resourceKey })

  return panelProps && <MainResourceCard {...panelProps} />
}
