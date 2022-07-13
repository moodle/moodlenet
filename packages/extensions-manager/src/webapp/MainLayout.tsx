import lib from 'moodlenet-react-app-lib'
import { FC, PropsWithChildren, useContext } from 'react'
import { StateContext, StateProvider } from './devModeContextProvider'
const MainLayout = lib.ui.components.layout.MainLayout
const Switch = lib.ui.components.atoms.Switch

export const ExtMngMainLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  lib.ui.components.organism.Header.useRightComponent({ StdHeaderItems: [DevModeBtn] })
  // lib.ui.components.organism.Header.useRightComponent({ Comp: DevModeBtn })
  return (
    <StateProvider>
      <MainLayout>{children}</MainLayout>
    </StateProvider>
  )
}

export const DevModeBtn: FC = () => {
  const { devMode, setDevMode } = useContext(StateContext)
  return (
    devMode && (
      <div className="dev-mode">
        <span className="label">Developer mode</span>
        <Switch enabled={!!devMode} size="medium" onClick={() => setDevMode(p => !p)} />
      </div>
    )
  )
}
