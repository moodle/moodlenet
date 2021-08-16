import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useNewResourceCtrl } from '../ui/pages/NewResource/Ctrl/NewResourceCtrl'
import { NewResource } from '../ui/pages/NewResource/NewResource'
import { MNRouteProps, RouteFC } from './lib'

export const NewResourceComponent: RouteFC<Routes.CreateNewResource> = () => {
  const props = ctrlHook(useNewResourceCtrl, {}, 'new-resourec-route')
  return <NewResource {...props} />
}

export const NewResourceRoute: MNRouteProps<Routes.CreateNewResource> = {
  component: NewResourceComponent,
  path: '/create-new-resource',
  exact: true,
}
