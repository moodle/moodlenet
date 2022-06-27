import { ExtModule } from '@moodlenet/react-app'
import * as rx from 'rxjs'
import * as op from 'rxjs/operators'
import { MNPriHttpExt } from '..'
import { dematMessage, sub } from './xhr-adapter'
export type PriHttpExtMod = ExtModule<MNPriHttpExt, typeof extMod>

const extMod = {
  sub,
  rx: {
    ...rx,
    op: {
      ...op,
      dematMessage,
    },
  },
}
export default extMod
