import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { matchSubjectHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { SubjectPageContainer } from './SubjectPageContainer'

export const SubjectPageRoute: FC = () => {
  const { pathname } = useLocation()

  const key = matchSubjectHomePageRoutePath(pathname)?.params.key
  if (!key) return null
  return <SubjectPageContainer subjectKey={key} key={key} />
}
