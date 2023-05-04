import type { ReactAppMainComponent } from '@moodlenet/react-app/webapp'
import { usePkgContext } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'

import type { MyPkgContext } from '../common/my-webapp/types.mjs'
import type { MainContextT } from './context/MainContext.mjs'
import { MainContext } from './context/MainContext.mjs'

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
