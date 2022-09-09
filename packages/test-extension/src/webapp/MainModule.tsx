import { ReactAppPluginMainModule, WebappPluginMainModule } from '@moodlenet/react-app'

import { TestExt } from '..'

export type TestExtensionWebappPlugin = WebappPluginMainModule<TestExt, { a: 1 }, [never, ReactAppPluginMainModule]>

const mainModule: TestExtensionWebappPlugin = {
  connect({ deps, http }) {
    const [, reactApp] = deps
    reactApp.ui
    http
      .fetch('testSub')({ paramIn1: 'xxx' })
      .then(resp => {
        console.log('testSub resp', JSON.stringify(resp, null, 2))
      })
    http.fetch('testEmpty')().then(console.log.bind(null, 'testEmpty'), console.error.bind(null, 'testEmpty'))
    http.fetch('testErr')().then(console.log.bind(null, 'testErr'), console.error.bind(null, 'testErr'))
    return {
      pkgLibFor(_) {
        return { a: 1 }
      },
    }
  },
}

export default mainModule
//<Route index element={<TestExtPage />} />
