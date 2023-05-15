import type { WebPkgDeps } from '../../common/types.mjs'
import { getCurrentPluginMainInitializerObject } from '../plugin-initializer.js'
import { pkgRpcs } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'
import type { WebappShell } from './webapp.mjs'
export * from '../app-routes.js'
export * from '../context/SettingsContext.js'
export {
  registerMainAppPluginHook,
  type MainAppPluginHook,
  type MainAppPluginHookResult,
  type MainAppPluginWrapper,
} from '../MainApp.js'
export * from '../types/plugins.mjs'
export { useMainLayoutProps } from '../ui/components/layout/MainLayout/MainLayoutHooks.mjs'
export { useSimpleLayoutProps } from '../ui/components/layout/SimpleLayout/SimpleLayoutHooks.mjs'
export { useFooterProps } from '../ui/components/organisms/Footer/MainFooter/MainFooterHooks.mjs'
export { useMinimalisticHeaderProps } from '../ui/components/organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
export {
  registerSettingsPagePluginHook,
  type SettingsPagePluginHook,
  type SettingsPagePluginHookResult,
  type SettingsPagePluginWrapper,
  type SettingsSectionItem,
} from '../ui/components/pages/Settings/Settings/Hook/SettingsHooks.js'
export { wrapFetch } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

export function getMyShell<UsesPkgDeps extends WebPkgDeps>(): WebappShell<UsesPkgDeps> {
  const { deps, pkgId } = getCurrentPluginMainInitializerObject()

  const rpc = Object.entries(deps).reduce((_rpc, [depName, { rpcPaths, targetPkgId }]) => {
    return { ..._rpc, [depName]: pkgRpcs(targetPkgId, pkgId, rpcPaths) }
  }, {} as WebappShell<UsesPkgDeps>['rpc'])
  const shell: WebappShell<UsesPkgDeps> = {
    pkgId,
    rpc,
  }
  return shell
}
