import { ReactAppMainComponent, usePkgContext } from '@moodlenet/react-app/web-lib'

import { OpenIdPkgContext } from '../common/webapp/types.mjs'
import { ProvideOpenIdContext } from './OpenIdContextProvider.js'

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const pkgContext = usePkgContext<OpenIdPkgContext>()

  return <ProvideOpenIdContext pkgContext={pkgContext}>{children}</ProvideOpenIdContext>
}
export default MainComponent
