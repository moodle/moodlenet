import assert from 'assert'
import { addWebappPluginItem } from './init.mjs'
import { AppearanceData, WebappPluginDef, WebappPluginItem } from '../common/types.mjs'
import { corePkg, kvStore } from './use-pkgs.mjs'
import { PkgContextT } from '../webapp/types/plugins.mjs'

export async function setAppearance({ appearanceData }: { appearanceData: AppearanceData }) {
  const data = await kvStore.set('appearanceData', '', appearanceData)
  return { valid: !data || !data.value ? false : true }
}

export async function getAppearance() {
  const data = await kvStore.get('appearanceData', '')
  assert(data.value, 'Appearance should be valued')
  return { data: data.value }
}

export async function setupPlugin<Ctx extends PkgContextT<any, any>>({
  pkgId,
  pluginDef,
}: Ctx extends PkgContextT<infer PkgId, infer Deps>
  ? {
      pluginDef: WebappPluginDef<Deps>
      pkgId: PkgId
    }
  : never) {
  const guestPkgEntry = await corePkg.api('active-pkgs/get-by-pkgid')(pkgId)
  assert(guestPkgEntry, `can't setup plugin, no guestPkgEntry for ${pkgId.name}@${pkgId.version}`)
  const webappPluginItem: WebappPluginItem<any> = {
    ...pluginDef,
    guestPkgId: pkgId,
    guestPkgInfo: guestPkgEntry.pkgInfo,
  }
  addWebappPluginItem(webappPluginItem)
}
