import { pkgEntryByPkgId, PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { addWebappPluginItem } from './init.mjs'
import { AppearanceData, WebappPluginDef, WebappPluginItem } from './types.mjs'
import { kvStore } from './use-pkg-apis.mjs'
import { WebPkgDepList } from './webapp/web-lib.mjs'

export async function setAppearance({ appearanceData }: { appearanceData: AppearanceData }) {
  const data = await kvStore.set('appearanceData', '', appearanceData)
  return { valid: !data || !data.value ? false : true }
}

export async function getAppearance() {
  const data = await kvStore.get('appearanceData', '')
  assert(data.value, 'Appearance should be valued')
  return { data: data.value }
}

export async function setupPlugin<Deps extends WebPkgDepList = never>({
  pkgId,
  pluginDef,
}: {
  pluginDef: WebappPluginDef<Deps>
  pkgId: PkgIdentifier<any>
}) {
  const guestPkgEntry = pkgEntryByPkgId(pkgId)
  assert(guestPkgEntry, `can't setup plugin, no guestPkgEntry for ${pkgId.name}@${pkgId.version}`)
  const webappPluginItem: WebappPluginItem<Deps> = {
    ...pluginDef,
    guestPkgId: pkgId,
    guestPkgInfo: guestPkgEntry.pkgInfo,
  }
  addWebappPluginItem(webappPluginItem)
}
