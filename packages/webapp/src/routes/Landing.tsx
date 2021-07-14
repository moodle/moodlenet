import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { createWithProps } from '../ui/lib/ctrl'
import { Landing, LandingProps } from '../ui/pages/Landing/Landing'
import { MNRouteProps, RouteFC } from './lib'

export const LandingRouteComponent: RouteFC<Routes.Landing> = (/* { match } */) => {
  const [LandingCtrl, landingProps] = withProps({ key: 'Landing Page' })(Landing)
  return <LandingCtrl {...landingProps} />
}

export const [Ctrl, withProps, withPropsList] = createWithProps<LandingProps, {}>(
  ({ __key, __uiComp: LandingUI, ...rest }) => {
    const landingProps: LandingProps = {} as any
    return <LandingUI {...landingProps} {...rest} key={__key} />
  },
)

export const LandingRoute: MNRouteProps<Routes.Landing> = {
  component: LandingRouteComponent,
  path: '/',
  exact: true,
}
