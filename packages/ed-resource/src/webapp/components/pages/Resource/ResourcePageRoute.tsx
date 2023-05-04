import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import { ResourcePageContainer } from './ResourcePageContainer.js'

export const ResourcePageRoute: FC = () => {
  const { key } = useParams()

  return <ResourcePageContainer resourceKey={key ?? ''} />
}
