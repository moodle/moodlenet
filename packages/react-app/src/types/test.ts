import { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import { ReactAppExtDef, ReactAppPluginMainModule, WebappPluginMainModule, WebPkgDeps } from '..'

export type TestExtDef = ExtDef<
  '@moodlenet/test-extension',
  '0.1.0',
  void,
  {
    testSub: SubTopo<{ paramIn1: string }, { out1: string }>
    _test: SubTopo<{ paramIn2: string }, { out2: number }>
  }
>
export type TestExt = Ext<TestExtDef, [CoreExt, ReactAppExtDef]>

export type TestExtensionWebappPluginX = WebappPluginMainModule<TestExt, { a: 1 }, [ReactAppPluginMainModule, void]>
export type TestExtensionWebappPlugin = WebappPluginMainModule<TestExt, { a: 1 }, [void, ReactAppPluginMainModule]>

const mainModule: TestExtensionWebappPlugin = {
  connect({ deps, http }) {
    const [a, reactApp] = deps
    reactApp.ui
    reactApp.uiasas
    http
      .fetch('testSub')({ paramIn1: 'xxx' })
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

declare const x: WebPkgDeps<[void, ReactAppPluginMainModule]>
const [a, b] = x
