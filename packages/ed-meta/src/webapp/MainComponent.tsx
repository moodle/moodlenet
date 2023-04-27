import { ReactAppMainComponent, usePkgContext } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'

import { MyPkgContext } from '../common/my-webapp/types.mjs'
import { MainContext, MainContextT } from './context/MainContext.mjs'

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const pkgContext = usePkgContext<MyPkgContext>()
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      ...pkgContext,
    }
    return ctx
  }, [pkgContext])

  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
