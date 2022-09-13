import {
  PluginMainComponent,
  ReactAppExtDef,
  ReactAppPluginMainModule,
  WebappPluginMainModule,
} from '@moodlenet/react-app'
import { useRef } from 'react'
import { Route } from 'react-router-dom'

import { TestExt } from '..'
import TestExtPage from './TestExtPage'

export type TestExtensionWebappPlugin = WebappPluginMainModule<TestExt, { a: 1 }, [never, ReactAppPluginMainModule]>

const routes = <Route path="my-page" element={<TestExtPage />} />
const mainModule: TestExtensionWebappPlugin = {
  connect({ deps, http, pkgHttp }) {
    const [, reactApp] = deps

    reactApp.auth.login.register({ Panel: () => <h1>Login Panel1</h1>, Icon: () => <span>login icon1</span> })
    reactApp.auth.login.register({ Panel: () => <h1>Login Panel2</h1>, Icon: () => <span>login icon2</span> })
    reactApp.auth.login.register({ Panel: () => <h1>Login Panel3</h1>, Icon: () => <span>login icon3</span> })
    reactApp.settings.section.register({ Content: () => <h1>Body</h1>, Menu: () => <span>menu</span> })

    reactApp.route.register({ routes, rootPath: 'ciccio' })
    reactApp.route.register({ routes })
    reactApp.header.rightComponent.register({ Component: () => <span>XXX</span> })
    reactApp.header.avatarMenuItem.register({
      Icon: () => <span>(3)</span>,
      Text: '3',
      Position: 3,
    })
    reactApp.header.avatarMenuItem.register({
      Icon: () => <span>(no)</span>,
      Text: 'no',
    })
    reactApp.header.avatarMenuItem.register({
      Icon: () => <span>(1)</span>,
      Text: '1',
      Position: 1,
    })

    http
      .fetch('testEmpty')()
      .then(
        _ => console.log('testEmpty', _),
        _ => console.error('testEmpty', _),
      )
    http
      .fetch('testErr')()
      .then(
        _ => console.log('testErr', _),
        _ => console.error('testErr', _),
      )
    const RAH = pkgHttp<ReactAppExtDef>('@moodlenet/react-app@0.1.0')
    RAH.fetch('getApparence')().then(_ => console.log('***', _))

    const MainComponent: PluginMainComponent = ({ children }) => {
      const ref = useRef<HTMLInputElement>(null)
      const { error, fetching, refresh, value } = http.useFetch('testSub', { paramIn1: ref.current?.value ?? '' })
      console.log({ error, fetching, refresh, value })
      return <>{children}</>
    }
    return {
      MainComponent,
      pkgLibFor(_) {
        return { a: 1 }
      },
    }
  },
}

export default mainModule
//<Route index element={<TestExtPage />} />
