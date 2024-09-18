import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { ProvideEdMetaContext } from './EdMetaContext'

const MainWrapper: MainAppPluginWrapper = ({ children }) => {
  return <ProvideEdMetaContext>{children}</ProvideEdMetaContext>
}

export default MainWrapper
