import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useNewCollectionCtrl } from '../ui/components/pages/NewCollection/Ctrl/NewCollectionCtrl'
import { NewCollection } from '../ui/components/pages/NewCollection/NewCollection'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const NewCollectionComponent: RouteFC<
  Routes.CreateNewCollection
> = () => {
  const props = ctrlHook(useNewCollectionCtrl, {}, 'new-collection-route')
  return <NewCollection {...props} />
}

export const NewCollectionRoute: MNRouteProps<Routes.CreateNewCollection> = {
  component: NewCollectionComponent,
  path: '/create-new-collection',
  exact: true,
}
