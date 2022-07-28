import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'

export type TestExt = ExtDef<
  'moodlenet-test-extension',
  '0.1.10',
  {
    testSub: SubTopo<{ paramIn1: string }, { out1: string }>
    _test: SubTopo<{ paramIn2: string }, { out2: number }>
  }
>

const ext: Ext<TestExt, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-test-extension@0.1.10',
  displayName: 'test ext',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    // business logic, wire-up to the message system,
    // other packages integration
    //   listen to messages -> send other messages
    //    use other packages plugins (e.g add UI to react app, or add http-endpoint)
    console.log('I am test extension')
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`moodlenet-test-extension: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
        routes: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
          rootPath: 'my-test', // http://localhost:3000/my-test
        },
      })
    })
    shell.expose({
      // http://localhost:8080/_/_/raw-sub/moodlenet-test-extension/0.1.10/_test  body:{"paramIn2": "33"}
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
    return {
      // code that allocate system resouces ( DB connections, listen to ports )
      // implement package's service messages
      deploy() {
        shell.lib.pubAll<TestExt>('moodlenet-test-extension@0.1.10', shell, {
          /* _test: ({ 
            msg: {
              data: {
                req: { paramIn2 },
              },
            },
          }) => { //returns ObservableInput<{ out2: number}> (from rxjs)
           // return [{ out2: Number(paramIn2) }]
           // return Promise.resolve({ out2: Number(paramIn2) })
           // return shell.lib.rx.of({ out2: Number(paramIn2) })
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
            return shell.lib.rx.interval(500).pipe(
              shell.lib.rx.take(5),
              shell.lib.rx.map(n => ({ out1: `${_.msg.data.req.paramIn1}\n\n(${n})` })),
            )
          },
        })
        return {}
      },
    }
  },
}

export default { exts: [ext] }
