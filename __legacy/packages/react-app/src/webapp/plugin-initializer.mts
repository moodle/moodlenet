import type { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import type { PluginMainInitializerObject } from '_connect-moodlenet-pkg-modules_'
import plugins from '_connect-moodlenet-pkg-modules_'

let currentPluginMainInitializerObject: PluginMainInitializerObject
export function getCurrentPluginMainInitializerObject(reason = '') {
  assert(
    currentPluginMainInitializerObject,
    `getCurrentPluginMainInitializerObject(${reason}) can only be accessed during initialization step`,
  )
  return currentPluginMainInitializerObject
}
export function getCurrentInitPkg(): PkgIdentifier {
  return getCurrentPluginMainInitializerObject('getCurrentInitPkg').pkgId
}
export async function initializePlugins() {
  bannerlog('initializing packages plugins')
  for (const pluginMainInitializerObject of plugins) {
    bannerlog(`initializing ${pluginMainInitializerObject.pkgId.name} ...`)
    currentPluginMainInitializerObject = pluginMainInitializerObject
    await pluginMainInitializerObject.init()
    bannerlog(`... ${pluginMainInitializerObject.pkgId.name} initialized`)
  }

  currentPluginMainInitializerObject = undefined as any
}

function bannerlog(...args: any[]) {
  console.log('\n', '*'.repeat(50), '\n', ...args, '\n', '*'.repeat(50), '\n')
}
