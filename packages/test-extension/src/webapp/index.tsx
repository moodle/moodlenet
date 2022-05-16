import type { RouterCtx } from '@moodlenet/webapp/lib/webapp/routes'
import { FC, useContext, useEffect } from 'react'
import { TestExtPage } from './TestExtPage'

const Cmp: FC<{ RouterCtx: RouterCtx }> = ({ children, RouterCtx }) => {
  const routerCtx = useContext(RouterCtx)
  useEffect(() => {
    routerCtx.addRoute({ Component: TestExtPage, path: '/test-extension', label: 'test-extension page' })
  }, [])
  return <>{children}</>
}

export default Cmp
