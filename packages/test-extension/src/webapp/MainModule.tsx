import {
  PluginMainComponent,
  ReactAppExtDef,
  ReactAppPluginMainModule,
  WebappPluginMainModule,
} from '@moodlenet/react-app'
import { useRef } from 'react'

import { TestExt } from '..'

export type TestExtensionWebappPlugin = WebappPluginMainModule<TestExt, { a: 1 }, [never, ReactAppPluginMainModule]>

const mainModule: TestExtensionWebappPlugin = {
  connect({ deps, http, pkgHttp }) {
    const [, reactApp] = deps

    reactApp.collectX.register({ a: 111 })

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
