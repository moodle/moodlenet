import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useNewPasswordCtrl } from '../ui/components/pages/Access/NewPassword/Ctrl/NewPassword'
import { NewPassword } from '../ui/components/pages/Access/NewPassword/NewPassword'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const NewPasswordRouteComponent: RouteFC<Routes.NewPassword> = ({
  match: {
    params: { token },
  },
}) => {
  const props = ctrlHook(
    useNewPasswordCtrl,
    { recoverPasswordToken: token },
    token
  )
  return <NewPassword {...props} />
}

export const NewPasswordRoute: MNRouteProps<Routes.NewPassword> = {
  component: NewPasswordRouteComponent,
  path: '/new-password/:token',
  exact: true,
}
