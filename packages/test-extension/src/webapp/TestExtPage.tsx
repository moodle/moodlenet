import { FC, useContext, useEffect, useRef } from 'react'
import { MainCtx } from './MainModule'

const ComponentItem = {
  Component() {
    const { current: rnd } = useRef(Math.random().toString(36).substring(2))
    useEffect(() => {
      console.log('rnd cmp + ', rnd)
      return () => console.log('rnd cmp - ', rnd)
    }, [rnd])
    return <span>added here {rnd}</span>
  },
}
const TestExtPage: FC = () => {
  const ctx = useContext(MainCtx)
  const [, reactApp] = ctx.shell.deps
  reactApp.header.rightComponent.useLocalRegister(ComponentItem)

  return (
    <reactApp.ui.components.MainLayout>
      <div>
        <h2>Test nice Extension</h2>
        <h3>...stuff</h3>
        <span>...more</span>
      </div>
    </reactApp.ui.components.MainLayout>
  )
}

export default TestExtPage
