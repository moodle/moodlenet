import { pluginHookCreator } from '@moodlenet/core/lib'
import { getCurrentInitPkg } from '../plugin-initializer.mjs'
export const createPluginHook = pluginHookCreator(getCurrentInitPkg)
