import type { ReactAppExtMain } from '@moodlenet/react-app/lib/webapp/types'
import { FC, PropsWithChildren, useContext, useEffect } from 'react'
import { TestExtPage } from './TestExtPage'

const ext: ReactAppExtMain<null> = ({ reactAppContainer: { RouterCtx } }) => {
  const Comp: FC<PropsWithChildren<{}>> = ({ children }) => {
    const routerCtx = useContext(RouterCtx)
    useEffect(() => {
      console.log('adding test extension route')
      routerCtx.addRoute({ Component: TestExtPage, path: '/test-extension', label: 'test-extension page' })
    }, [])
    return <>{children}</>
  }

  return {
    Comp,
    instance: null,
  }
}
export default ext
