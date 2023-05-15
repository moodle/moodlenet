import type { PkgIdentifier } from '@moodlenet/core'
import type { ComponentType, FC, PropsWithChildren } from 'react'
import { getCurrentInitPkg } from './plugin-initializer.mjs'

export type MainAppPluginWrapper = ComponentType<PropsWithChildren>
export type MainAppPluginHookResult = { MainWrapper?: MainAppPluginWrapper }
export type MainAppPluginHook = () => void | MainAppPluginHookResult

const mainAppPluginPlugins: {
  mainAppPluginHook: MainAppPluginHook
  pkgId: PkgIdentifier
}[] = []

export function registerMainAppPluginHook(mainAppPluginHook: MainAppPluginHook) {
  const pkgId = getCurrentInitPkg()
  mainAppPluginPlugins.push({ mainAppPluginHook, pkgId })
}

export const MainApp: FC<PropsWithChildren> = ({ children }) => {
  const Main = mainAppPluginPlugins.reduce((_children, { pkgId, mainAppPluginHook }) => {
    const { MainWrapper } = mainAppPluginHook() ?? {}

    return MainWrapper ? (
      <MainWrapper key={`${pkgId.name}`}>{_children}</MainWrapper>
    ) : (
      <>{children}</>
    )
  }, <>{children}</>)
  return Main
}
