import assert from 'assert'
import type { PluginMainInitializerObject } from '_connect-moodlenet-pkg-modules_'
import plugins from '_connect-moodlenet-pkg-modules_'

let currentPluginMainInitializerObject: PluginMainInitializerObject
export function getCurrentPluginMainInitializerObject() {
  assert(
    currentPluginMainInitializerObject,
    'currentPluginMainInitializerObject can only be accessed during initialization step',
  )
  return currentPluginMainInitializerObject
}
export function getCurrentInitPkg() {
  return getCurrentPluginMainInitializerObject().pkgId
}
export async function initializePlugins() {
  for (const pluginMainInitializerObject of plugins) {
    currentPluginMainInitializerObject = pluginMainInitializerObject
    await pluginMainInitializerObject.init()
  }

  currentPluginMainInitializerObject = undefined as any
}
