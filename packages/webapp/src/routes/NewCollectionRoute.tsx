import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useNewCollectionCtrl } from '../ui/pages/NewCollection/Ctrl/NewCollectionCtrl'
import { NewCollection } from '../ui/pages/NewCollection/NewCollection'
import { MNRouteProps, RouteFC } from './lib'

export const NewCollectionComponent: RouteFC<Routes.CreateNewCollection> = () => {
  const props = ctrlHook(useNewCollectionCtrl, {})
  return <NewCollection {...props} />
}

export const NewCollectionRoute: MNRouteProps<Routes.CreateNewCollection> = {
  component: NewCollectionComponent,
  path: '/create-new-collection',
  exact: true,
}
