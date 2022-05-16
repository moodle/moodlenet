import { nodeSlugId } from '@moodlenet/common/dist/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { getContentNodeHomePageRoutePath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useSubjectCtrl } from '../ui/components/pages/Subject/Ctrl/SubjectPageCtrl'
import { Subject } from '../ui/components/pages/Subject/Subject'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const SubjectRouteComponent: RouteFC<Routes.ContentNodeHomePage> = ({
  match: {
    params: { slug },
  },
}) => {
  const id = nodeSlugId('IscedField', slug)
  const props = ctrlHook(useSubjectCtrl, { id }, `route-${id}`)
  return <Subject {...props} />
}

export const SubjectRoute: MNRouteProps<Routes.ContentNodeHomePage> = {
  component: SubjectRouteComponent,
  path: getContentNodeHomePageRoutePath('IscedField'),
  exact: true,
}
