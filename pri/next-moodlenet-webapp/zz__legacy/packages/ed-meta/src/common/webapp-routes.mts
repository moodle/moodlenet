import { compile, match, webSlug } from '@moodlenet/react-app/common'

export const SUBJECT_HOME_PAGE_ROUTE_PATH = '/subject/:key/:slug'
type KeySlugParams = { key: string; slug: string }
const subjectHomePageRoutePath = compile<KeySlugParams>(SUBJECT_HOME_PAGE_ROUTE_PATH)

export function getSubjectHomePageRoutePath({ _key, title }: { _key: string; title: string }) {
  const slug = webSlug(title)
  return subjectHomePageRoutePath({ key: _key, slug })
}

const _matchSubjectHomePageRoutePath = match<KeySlugParams>(SUBJECT_HOME_PAGE_ROUTE_PATH)
export function matchSubjectHomePageRoutePath(path: string) {
  return _matchSubjectHomePageRoutePath(path) || null
}
