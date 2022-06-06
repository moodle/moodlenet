import type { Ext, ExtDef, KernelExt, SubTopo } from '@moodlenet/kernel'
import type { ReactAppExt } from '@moodlenet/react-app'

export type TestExt = ExtDef<
  'moodlenet.test-extension',
  '0.1.10',
  {
    testSub: SubTopo<{ XX: string }, { a: string }>
    _test: SubTopo<{ a: string }, { b: number }>
  }
>

const ext: Ext<TestExt, [KernelExt, ReactAppExt]> = {
  id: 'moodlenet.test-extension@0.1.10',
  displayName: 'test ext',
  requires: ['moodlenet.kernel@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    console.log('I am test extension')
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10`, inst)
      inst.ensureExtension({
        cmpPath: 'lib/webapp',
      })
    })
    shell.expose({
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
      deploy() {
        shell.lib.pubAll<TestExt>('moodlenet.test-extension@0.1.10', shell, {
          _test: ({
            msg: {
              data: {
                req: { a },
              },
            },
          }) => [{ b: Number(a) }],
          testSub(_) {
            return shell.lib.rx.interval(500).pipe(
              shell.lib.rx.take(5),
              shell.lib.rx.map(n => ({ a: `${_.msg.data.req.XX}\n\n(${n})` })),
            )
          },
        })
        return {}
      },
    }
  },
}

export default [ext]
