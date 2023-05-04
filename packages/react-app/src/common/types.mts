import type { BaseStyleType } from '@moodlenet/component-library'
import type { PackageInfo, PkgExpose, PkgExposeDef, PkgIdentifier } from '@moodlenet/core'
import type { CSSProperties } from 'react'

export type WebPkgDeps = {
  [k in string]: PkgExposeDef
}

export type WebappPluginDef<
  Deps extends WebPkgDeps | Record<string, never> = Record<string, never>,
> = {
  mainComponentLoc: string[]
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
  //TODO
  //@BRU //TODO //@ETTO decide if having this as optional
  customStyle?: CustomStyleType
}

export type AssetInfo = {
  location: string | File
  credits?: Credits | null
}

export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}
