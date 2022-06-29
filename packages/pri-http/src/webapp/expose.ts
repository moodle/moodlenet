import { ExtModule } from '@moodlenet/react-app'
import { MNPriHttpExt } from '..'
import { dematMessage, sub } from './xhr-adapter'
export type PriHttpExtMod = ExtModule<MNPriHttpExt, typeof extMod>

const extMod = {
  sub,
  dematMessage,
}
export default extMod
