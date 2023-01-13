import assert from 'assert'
import { AppearanceData, WebappPluginDef, WebappPluginItem, WebPkgDeps } from '../common/types.mjs'
import kvStore from './kvStore.mjs'
import { addWebappPluginItem } from './webapp-plugins.mjs'
import shell from './shell.mjs'
import { PkgIdentifier } from '@moodlenet/core'

export async function setAppearance({ appearanceData }: { appearanceData: AppearanceData }) {
  const data = await kvStore.set('appearanceData', '', appearanceData)
  return { valid: !data || !data.value ? false : true }
}

export async function getAppearance() {
  const data = await kvStore.get('appearanceData', '')
  assert(data.value, 'Appearance should be valued')
  return { data: data.value }
}

export async function setupPlugin<Deps extends WebPkgDeps>({
  pluginDef,
  pkgId,
}: {
  pluginDef: WebappPluginDef<Deps>
  pkgId: PkgIdentifier
}) {
  const guestPkgEntry = await shell.pkgEntryByPkgIdValue(pkgId)
  assert(
    guestPkgEntry,
    `can't setup react-app plugin, no pkgEntry for ${pkgId.name}@${pkgId.version}`,
  )
  const webappPluginItem: WebappPluginItem<any> = {
    ...pluginDef,
    guestPkgId: guestPkgEntry.pkgId,
    guestPkgInfo: guestPkgEntry.pkgInfo,
  }
  addWebappPluginItem(webappPluginItem)
}

export async function plugin<Deps extends WebPkgDeps>({
  pluginDef,
}: {
  pluginDef: WebappPluginDef<Deps>
}) {
  const pkgId = shell.assertCallInitiator()
  return setupPlugin<Deps>({ pkgId, pluginDef })
}
