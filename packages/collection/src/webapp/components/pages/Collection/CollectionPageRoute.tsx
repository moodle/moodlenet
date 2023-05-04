import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionContainer } from './CollectionPageContainer.js'

export const CollectionPageRoute: FC = () => {
  const { key } = useParams()

  return <CollectionContainer collectionKey={key ?? ''} />
}
