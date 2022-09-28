import { PackageInfo } from '@moodlenet/core'
import assert from 'assert'
import { addWebappPluginItem } from './init.mjs'
import { AppearanceData, WebappPluginDef, WebappPluginItem } from './types.mjs'
import { kvStore } from './use-pkg-apis.mjs'

export async function setAppearance({ appearanceData }: { appearanceData: AppearanceData }) {
  const data = await kvStore.set('appearanceData', '', appearanceData)
  return { valid: !data || !data.value ? false : true }
}

export async function getAppearance() {
  const data = await kvStore.get('appearanceData', '')
  assert(data.value, 'Appearance should be valued')
  return { data: data.value }
}

export async function setupPlugin({ pkgInfo, pluginDef }: { pluginDef: WebappPluginDef; pkgInfo: PackageInfo }) {
  const webappPluginItem: WebappPluginItem = {
    ...pluginDef,
    guestPkgInfo: pkgInfo,
  }
  addWebappPluginItem(webappPluginItem)
}
