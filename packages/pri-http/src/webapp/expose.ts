import { ExtModule } from '@moodlenet/react-app'
import { MNPriHttpExt } from '..'
import { sub } from './xhr-adapter'
export type PriHttpExtMod = ExtModule<MNPriHttpExt, typeof extMod>

const extMod = { sub }
export default { sub }
