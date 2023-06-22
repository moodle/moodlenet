import { pluginCreator } from '@moodlenet/core/lib'
import { getCurrentInitPkg } from '../plugin-initializer.mjs'
export const createPlugin = pluginCreator(getCurrentInitPkg)
