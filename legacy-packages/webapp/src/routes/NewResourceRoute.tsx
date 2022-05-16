import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useNewResourceCtrl } from '../ui/components/pages/NewResource/Ctrl/NewResourceCtrl'
import { NewResource } from '../ui/components/pages/NewResource/NewResource'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const NewResourceComponent: RouteFC<Routes.CreateNewResource> = () => {
  const props = ctrlHook(useNewResourceCtrl, {}, 'new-resource-route')
  return <NewResource {...props} />
}

export const NewResourceRoute: MNRouteProps<Routes.CreateNewResource> = {
  component: NewResourceComponent,
  path: '/create-new-resource',
  exact: true,
}
