import getStore from '@moodlenet/key-value-store'
import { AppearanceData } from '../common/types.mjs'
import shell from './shell.mjs'

export type KeyValueData = { appearanceData: AppearanceData }

export default await getStore<KeyValueData>(shell)
