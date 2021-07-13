import { Routes } from '../../../common/lib/webapp/sitemap'
import { useRedirectHomeIfLoggedIn } from '../hooks/glob/nav'
import { useActivateNewUserPanelProps } from '../hooks/props/ActivateNewUserPanel'
import { createWithProps } from '../ui/lib/ctrl'
import { ActivateNewUserPage, ActivateNewUserPanelProps } from '../ui/pages/ActivateNewUser/ActivateNewUser'
import { MNRouteProps, RouteFC } from './lib'

export const ActivateNewUserComponent: RouteFC<Routes.ActivateNewUser> = ({
  match: {
    params: { token },
  },
}) => {
  useRedirectHomeIfLoggedIn()

  const activateNewUserPanelWithProps = withPropsList_ActivateNewUserPanelCtrl([{ token, key: token }])
  return <ActivateNewUserPage withNewUserPanelWithProps={activateNewUserPanelWithProps} />
}

export const ActivateNewUserRoute: MNRouteProps<Routes.ActivateNewUser> = {
  component: ActivateNewUserComponent,
  path: '/activate-new-user/:token',
  exact: true,
}

// const ActivateNewUserPanelCtrl: Ctrl<ActivateNewUserPanelProps, { token: string }, 'mycss'> = ({
export const [
  ActivateNewUserPanelCtrl,
  withProps_ActivateNewUserPanelCtrl,
  withPropsList_ActivateNewUserPanelCtrl,
] = createWithProps<ActivateNewUserPanelProps, { token: string }, 'mycss'>(
  ({ __key, __uiComp: UIComp, token, ...restProps }) => {
    const props = useActivateNewUserPanelProps({ token })
    return <UIComp {...{ ...props, ...restProps }} />
  },
)
