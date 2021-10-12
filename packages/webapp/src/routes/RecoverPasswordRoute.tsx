import { Routes } from 'my-moodlenet-common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useRecoverPasswordCtrl } from '../ui/pages/Access/RecoverPassword/Ctrl/RecoverPassword'
import { RecoverPassword } from '../ui/pages/Access/RecoverPassword/RecoverPassword'
import { MNRouteProps, RouteFC } from './lib'

export const RecoverPasswordRouteComponent: RouteFC<Routes.RecoverPassword> = (/* { match } */) => {
  const props = ctrlHook(useRecoverPasswordCtrl, {}, 'recoverpassword-route')
  return <RecoverPassword {...props} />
}

export const RecoverPasswordRoute: MNRouteProps<Routes.RecoverPassword> = {
  component: RecoverPasswordRouteComponent,
  path: '/recover-password',
  exact: true,
}
