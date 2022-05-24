import type { ReactAppExtMain } from '@moodlenet/react-app/lib/webapp/types'
import { FC, useContext, useEffect } from 'react'
import { TestExtPage } from './TestExtPage'

const ext: ReactAppExtMain<null> = ({ RouterCtx }) => {
  const Comp: FC = ({ children }) => {
    const routerCtx = useContext(RouterCtx)
    useEffect(() => {
      routerCtx.addRoute({ Component: TestExtPage, path: '/test-extension', label: 'test-extension page' })
    }, [])
    return <>{children}</>
  }

  return {
    Comp,
    handle: null,
  }
}
export default ext
