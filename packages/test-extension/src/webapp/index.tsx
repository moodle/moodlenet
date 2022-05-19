import type { ExtCmp } from '@moodlenet/react-app/lib/webapp/types'
import { useContext, useEffect } from 'react'
import { TestExtPage } from './TestExtPage'

const Cmp: ExtCmp = ({ children, RouterCtx }) => {
  const routerCtx = useContext(RouterCtx)
  useEffect(() => {
    routerCtx.addRoute({ Component: TestExtPage, path: '/test-extension', label: 'test-extension page' })
  }, [])
  return <>{children}</>
}

export default Cmp
