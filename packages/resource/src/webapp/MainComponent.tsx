import { ReactAppMainComponent, usePkgContext } from '@moodlenet/react-app/web-lib'

import { useEffect } from 'react'
import { MyPkgContext } from '../common/types.mjs'
import { MainContext } from './MainContext.js'

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const {
    use: { me },
  } = myPkgCtx

  useEffect(() => {
    me.rpc['webapp/xxxx/xxx']({ param: 'moodlenet' }).then(res => {
      console.log(`sample call response:`, res)
    })
  }, [me.rpc])

  return (
    <MainContext.Provider
      value={{
        ...myPkgCtx,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}

export default MainComponent
