import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { matchCollectionHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { CollectionContainer } from './CollectionPageContainer.js'

export const CollectionPageRoute: FC = () => {
  const { pathname, state } = useLocation()
  const key = matchCollectionHomePageRoutePath(pathname)?.params.key
  if (!key) return null
  return <CollectionContainer collectionKey={key} key={key} editMode={!!(state as any)?.editMode} />
}
