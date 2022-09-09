import { WebappPluginMainModule } from '@moodlenet/react-app'
import { ReactAppPluginMainModule } from '@moodlenet/react-app/src/webapp/types'
import { TestExt, TestExtDef } from '..'

export type TestExtensionWebappPlugin = WebappPluginMainModule<
  TestExt,
  { a: 1 },
  { '@moodlenet/react-app': ReactAppPluginMainModule }
>

const mainModule: TestExtensionWebappPlugin = {
  connect({ deps }) {
    const { '@moodlenet/react-app': reactApp } = deps
    reactApp.priHttp
      .fetch<TestExtDef>(
        '@moodlenet/test-extension',
        '0.1.0',
      )('testSub')({ paramIn1: 'xxx' })
      .then(resp => {
        console.log('testSub resp', JSON.stringify(resp, null, 2))
      })

    return {
      pkgLibFor(_) {
        return { a: 1 }
      },
    }
  },
}

export default mainModule
//<Route index element={<TestExtPage />} />
