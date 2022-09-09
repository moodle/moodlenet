import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { ReactAppExtDef } from '@moodlenet/react-app'
import { resolve } from 'path'

export type TestExtDef = ExtDef<
  '@moodlenet/test-extension',
  '0.1.0',
  void,
  {
    testErr: SubTopo<void, void>
    testEmpty: SubTopo<void, void>
    testSub: SubTopo<{ paramIn1: string }, { out1: string }>
    _test: SubTopo<{ paramIn2: string }, { out2: number }>
  }
>
export type TestExt = Ext<TestExtDef, [CoreExt, ReactAppExtDef]>
const ext: TestExt = {
  name: '@moodlenet/test-extension',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0'],
  connect(shell) {
    const [, reactApp] = shell.deps
    reactApp.plug.setup({
      mainModuleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainModule.tsx'),
    })

    return {
      deploy() {
        // business logic, wire-up to the message system,
        // other packages integration
        //   listen to messages -> send other messages
        //    use other packages plugins (e.g add UI to react app, or add http-endpoint)

        shell.expose({
          // http://localhost:8080/_/_/raw-sub/@moodlenet/test-extension/0.1.0/_test  body:{"paramIn2": "33"}
          '_test/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
          'testSub/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
          'testEmpty/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
          'testErr/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
        })
        // code that allocate system resouces ( DB connections, listen to ports )
        // implement package's service messages

        shell.provide.services({
          /* _test: ({ 
            msg: {
              data: {
                req: { paramIn2 },
              },
            },
          }) => { //returns ObservableInput<{ out2: number}> (from rxjs)
           // return [{ out2: Number(paramIn2) }]
           // return Promise.resolve({ out2: Number(paramIn2) })
           // return shell.rx.of({ out2: Number(paramIn2) })
           return [{ out2: Number(paramIn2) }]
          }, */
          /*  async _test({
            msg: {
              data: {
                req: { paramIn2 },
              },
            },
          }) {
            // call DB or call another service
            // read fileasystem
            return { out2: Number(paramIn2) }
          }, */
          _test({ paramIn2 }) {
            return [{ out2: Number(paramIn2) }, { out2: Number(paramIn2) + 1 }]
          },
          testEmpty() {
            return []
          },
          testErr() {
            throw new Error('xxxx AHHAHA')
          },
          testSub({ paramIn1 }) {
            return shell.rx.interval(500).pipe(
              shell.rx.take(5),
              shell.rx.map(n => ({ out1: `${paramIn1}\n\n(${n})` })),
            )
          },
        })
        return {}
      },
    }
  },
}

export default ext
