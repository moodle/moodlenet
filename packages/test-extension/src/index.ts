import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'

export type TestExt = ExtDef<
  '@moodlenet/test-extension',
  '0.1.0',
  void,
  {
    testSub: SubTopo<{ paramIn1: string }, { out1: string }>
    _test: SubTopo<{ paramIn2: string }, { out2: number }>
  }
>

const ext: Ext<TestExt, [CoreExt, ReactAppExt]> = {
  name: '@moodlenet/test-extension',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0'],
  connect(shell) {
    const [, reactApp] = shell.deps

    return {
      deploy() {
        // business logic, wire-up to the message system,
        // other packages integration
        //   listen to messages -> send other messages
        //    use other packages plugins (e.g add UI to react app, or add http-endpoint)
        console.log('I am test extension')
        reactApp.plug.setup({
          routes: {
            moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
            rootPath: 'my-test', // http://localhost:3000/my-test
          },
        })

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
          _test({
            msg: {
              data: {
                req: { paramIn2 },
              },
            },
          }) {
            return [{ out2: Number(paramIn2) }, { out2: Number(paramIn2) + 1 }]
          },
          testSub(_) {
            return shell.rx.interval(500).pipe(
              shell.rx.take(5),
              shell.rx.map(n => ({ out1: `${_.msg.data.req.paramIn1}\n\n(${n})` })),
            )
          },
        })
        return {}
      },
    }
  },
}

export default ext
