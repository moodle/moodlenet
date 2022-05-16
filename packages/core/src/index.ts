import { Ext, ExtDef, pubAll, SubTopo } from '@moodlenet/kernel'
export * as K from '@moodlenet/kernel'
export * as coreExt from './core-extensions'

export type MoodlenetCoreExt = ExtDef<
  'moodlenet.core',
  '0.1.10',
  {
    _test: SubTopo<{ a: string }, { a: number }>
  }
>

const extImpl: Ext<MoodlenetCoreExt> = {
  id: 'moodlenet.core@0.1.10',
  displayName: '',
  requires: [],
  description: '',
  enable(shell) {
    console.log('I am core extension')
    return {
      deploy({}) {
        pubAll<MoodlenetCoreExt>('moodlenet.core@0.1.10', shell, {
          _test({ msg }) {
            msg.pointer
            msg.data.req.a.at
            return [{ a: 1 }]
          },
        })

        return {}
      },
    }
  },
}

export default [extImpl]
