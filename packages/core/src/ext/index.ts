import type { Ext, ExtDef, SubTopo } from '@moodlenet/kernel'
import type { K } from '@moodlenet/kernel/lib/kernel-core'
import type { PkgMngLib } from '@moodlenet/kernel/lib/npm-pkg'

export type MoodlenetCoreExt = ExtDef<
  'moodlenet.core',
  '0.1.10',
  {
    _test: SubTopo<{ a: string }, { a: number }>
  }
>

type Cfg = {
  pkgMng: PkgMngLib
  K: K
}
export function getCoreExt(cfg: Cfg) {
  cfg
  const coreExt: Ext<MoodlenetCoreExt> = {
    id: 'moodlenet.core@0.1.10',
    displayName: '',
    requires: [],
    description: '',
    enable(shell) {
      console.log('I am core extension')
      shell.expose({
        '_test/sub': {
          validate: () => ({ valid: true }),
        },
      })
      return {
        deploy({}) {
          shell.lib.pubAll<MoodlenetCoreExt>('moodlenet.core@0.1.10', shell, {
            _test({ msg }) {
              // msg.pointer
              // msg.data.req.a.at
              // const rx = shell.lib.rx
              return [
                { a: msg.data.req.a.length },
                { a: msg.data.req.a.length },
                { a: msg.data.req.a.length },
                { a: msg.data.req.a.length },
              ]
              // return Promise.resolve({ a: msg.data.req.a.length })
              // return rx.interval(1000).pipe(
              //   rx.take(3),
              //   rx.map(n => {
              //     return { a: msg.data.req.a.length + n }
              //   }),
              //   rx.delay(1000),
              // )
            },
          })

          return {}
        },
      }
    },
  }
  return coreExt
}
