import type { RpcFile } from '@moodlenet/core'
import { assertRpcFileReadable, readableRpcFile } from '@moodlenet/core'
import assert from 'assert'
import sharp from 'sharp'
import type {
  AppearanceData,
  WebappPluginDef,
  WebappPluginItem,
  WebPkgDeps,
} from '../common/types.mjs'
import { httpApp } from './init/http-server.mjs'
import { kvStore } from './init/kvStore.mjs'
import { shell } from './shell.mjs'
import { addWebappPluginItem } from './webpack/webapp-plugins.mjs'

export type ImageKind = 'image' | 'icon'
export async function webImageResizer(original: RpcFile, imageKind: ImageKind): Promise<RpcFile> {
  const { value: configs } = await kvStore.get('configs', '')
  assert(configs)
  const { webIconSize, webImageSize } = configs

  const originalReadable = await assertRpcFileReadable(original)

  const [width, height] = imageKind === 'icon' ? webIconSize : webImageSize
  const imagePipeline = sharp({ sequentialRead: true }).resize({
    width,
    height,
    fit: 'inside',
    withoutEnlargement: true,
  })
  originalReadable.pipe(imagePipeline)
  const resizedRpc = readableRpcFile({ ...original, size: NaN }, () => imagePipeline)
  return resizedRpc
}

export async function setAppearance({ appearanceData }: { appearanceData: AppearanceData }) {
  await kvStore.set('appearanceData', '', appearanceData)
  return { valid: true }
}

export async function getAppearance() {
  const data = await kvStore.get('appearanceData', '')
  assert(data.value, 'Appearance should be valued')
  return { data: data.value }
}

export async function plugin<Deps extends WebPkgDeps>(pluginDef: WebappPluginDef<Deps>) {
  const { pkgId } = shell.assertCallInitiator()
  const guestPkgEntry = await shell.pkgEntryByPkgIdValue(pkgId)
  assert(
    guestPkgEntry,
    `can't setup react-app plugin, no pkgEntry for ${pkgId.name}@${pkgId.version}`,
  )
  const webappPluginItem: WebappPluginItem = {
    ...pluginDef,
    guestPkgId: guestPkgEntry.pkgId,
    guestPkgInfo: guestPkgEntry.pkgInfo,
  }
  await addWebappPluginItem(webappPluginItem)
}

export function getWebappUrl(path = '') {
  return `${httpApp.baseUrl}${path.replace(/^\//, '')}`
}
