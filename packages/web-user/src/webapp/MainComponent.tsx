import { ReactAppMainComponent } from '@moodlenet/react-app'
import { createContext, useMemo } from 'react'
import { MainContextT, MyUsesPkgs } from './types.mjs'

export const MainContext = createContext<MainContextT>(null as any)
const MainComponent: ReactAppMainComponent<MyUsesPkgs> = ({ pkgs, children }) => {
  // reactApp.header.avatarMenuItem.register(headerComponents)
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
    }
    return ctx
  }, [])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
