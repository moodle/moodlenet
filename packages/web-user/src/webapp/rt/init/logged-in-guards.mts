import { ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import { useNeedsWebUserLogin } from '../exports.mjs'

ResourcePagePlugins.register(function usePluginHook({ info }) {
  const disable = !info ? true : !info.isCreating
  useNeedsWebUserLogin({ disable })
  return {}
})
