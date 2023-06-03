import { hookPluginCreator } from '@moodlenet/core/lib'
import { getCurrentInitPkg } from '../plugin-initializer.mjs'
export const createHookPlugin = hookPluginCreator(getCurrentInitPkg)
