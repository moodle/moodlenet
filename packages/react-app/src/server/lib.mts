import { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { addWebappPluginItem } from './init.mjs'
import { AppearanceData, WebappPluginDef, WebappPluginItem } from '../common/types.mjs'
import { corePkg, kvStore } from './use-pkgs.mjs'
import { WebPkgDepList } from '../webapp/web-lib.mjs'

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
  pkgId: PkgIdentifier
}) {
  const guestPkgEntry = await corePkg.api('active-pkgs/get-by-pkgid')(pkgId)
  assert(guestPkgEntry, `can't setup plugin, no guestPkgEntry for ${pkgId.name}@${pkgId.version}`)
  const webappPluginItem: WebappPluginItem<Deps> = {
    ...pluginDef,
    guestPkgId: pkgId,
    guestPkgInfo: guestPkgEntry.pkgInfo,
  }
  addWebappPluginItem(webappPluginItem)
}
