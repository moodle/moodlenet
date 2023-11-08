import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { matchResourceHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { ResourcePageContainer } from './ResourcePageContainer.js'

export const ResourcePageRoute: FC = () => {
  const { pathname } = useLocation()

  const key = matchResourceHomePageRoutePath(pathname)?.params.key
  if (!key) return null
  return <ResourcePageContainer resourceKey={key} key={key} />
}

export const CreateResourcePageRoute: FC = () => {
  return <ResourcePageContainer resourceKey={'.'} key={'new-resource'} />
}
