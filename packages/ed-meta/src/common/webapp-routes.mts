import { compile, match, webSlug } from '@moodlenet/react-app/common'

export const SUBJECT_HOME_PAGE_ROUTE_PATH = '/subject/:key/:slug'
type SubjectHomePageParams = { key: string; slug: string }
export const subjectHomePageRoutePath = compile<SubjectHomePageParams>(SUBJECT_HOME_PAGE_ROUTE_PATH)

export function getSubjectHomePageRoutePath({ _key, title }: { _key: string; title: string }) {
  const slug = webSlug(title)
  return subjectHomePageRoutePath({ key: _key, slug })
}

const _matchSubjectHomePageRoutePath = match<SubjectHomePageParams>(SUBJECT_HOME_PAGE_ROUTE_PATH)
export function matchSubjectHomePageRoutePath(path: string) {
  return _matchSubjectHomePageRoutePath(path) || null
}
