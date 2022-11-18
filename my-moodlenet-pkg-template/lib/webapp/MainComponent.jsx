import { registries } from '@moodlenet/react-app/web-lib'
import Router from './Router.jsx'

const MainComponent = ({ pkgs, pkgId, children }) => {
  registries.routes.useRegister(pkgId, Router)

  return <>{children}</>
}
MainComponent.displayName = 'MyMainComponent'

export default MainComponent
