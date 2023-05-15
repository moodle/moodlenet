import type { PkgIdentifier } from '@moodlenet/core'
import type { ComponentType, FC, PropsWithChildren } from 'react'
import { getCurrentInitPkg } from './plugin-initializer.js'

const mainAppContextPlugins: {
  mainAppContextPlugin: MainAppContextPlugin
  pkgId: PkgIdentifier
}[] = []
export type MainAppContextPlugin = { MainComponent: ComponentType<PropsWithChildren> }
export function registerMainAppContextPlugin(mainAppContextPlugin: MainAppContextPlugin) {
  const pkgId = getCurrentInitPkg()
  mainAppContextPlugins.push({ mainAppContextPlugin, pkgId })
}

export const MainAppContext: FC<PropsWithChildren> = ({ children }) => {
  const Main = mainAppContextPlugins.reduce(
    (_children, { pkgId, mainAppContextPlugin: { MainComponent } }) => (
      <MainComponent key={`${pkgId.name}`}>{_children}</MainComponent>
    ),
    <>{children}</>,
  )
  return Main
}
