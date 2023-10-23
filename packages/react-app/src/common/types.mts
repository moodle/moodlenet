import type { BaseStyleType } from '@moodlenet/component-library/common'
import type { PackageInfo, PkgExpose, PkgExposeDef, PkgIdentifier } from '@moodlenet/core'
import type { CSSProperties } from 'react'

export type WebPkgDeps = {
  [k in string]: PkgExposeDef
}

export type WebappPluginDef<
  Deps extends WebPkgDeps | Record<string, never> = Record<string, never>,
> = {
  initModuleLoc: string[]
  deps: {
    [depname in keyof Deps]: PkgExpose<Deps[depname]>
  }
}

export type WebappPluginItem<Deps extends WebPkgDeps = WebPkgDeps> = WebappPluginDef<Deps> & {
  guestPkgInfo: PackageInfo
  guestPkgId: PkgIdentifier
}

export type CustomStyleType = BaseStyleType & CSSProperties
export type AppearanceData = {
  logo: string
  smallLogo: string
  color: string
  //TODO //@BRU //@ETTO decide if having this as optional
  customStyle?: CustomStyleType
}
