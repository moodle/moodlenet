'use client'
import { gateProvider } from '@moodle/domain/gate'
import { gateClient } from '@moodle/domain/lib'
import { any_ } from '@moodle/lib-types'
import { createContext, PropsWithChildren, use, useContext, useState } from 'react'

// import { getUserLevelDetails } from './user-levels/lib'
// import { linkedContent } from '@moodle/module/moodlenet'
type webappGlobals = unknown
export type serverGlobals = {
  policiesInfo: moo.def.policies.user.info
  gateClientDispatcher: moo.def.gate.client.dispatcher
  get?: () => Promise<moo.def.policies.user.info | null>
}
export type globalCtx = webappGlobals & serverGlobals
export const GlobalCtx = createContext<globalCtx>(null as any_)

export function GlobalContextProvider({ children, serverGlobals: { gateClientDispatcher, get, policiesInfo } }: PropsWithChildren<{ serverGlobals: serverGlobals }>) {
  const globalCtx: globalCtx = {
    policiesInfo,
    get,
    gateClientDispatcher: gateClientDispatcher,
  }
  const gate = gateClient({
    policiesInfo,
    gateProvider,
    gateClientDispatcher,
  })
  const [_, __] = useState<Promise<unknown>>(Promise.resolve(null))
  const ___ = use(_)
  return (
    <>
      <button onClick={() => __(Promise.resolve(get?.()))}>get</button>
      <button onClick={() => __(Promise.resolve(gate.any().accessControl().policies().readMyOwn().policiesInfo().send?.()))}>__get</button>
      <pre>{JSON.stringify({ ___ }, null, 2)}</pre>
      <GlobalCtx.Provider value={globalCtx}>{children}</GlobalCtx.Provider>
    </>
  )
}

export function useGlobalCtx() {
  return useContext(GlobalCtx)
}

// export function useAllPrimarySchemas() {
//   const allSchemaConfigs = useGlobalCtx().allSchemaConfigs
//   const primarySchemas = makeAllPrimarySchemas(allSchemaConfigs)
//   return primarySchemas
// }

// export function useAssetUrl(asset: maybeAsset | nullish, defaultTo?: url_string | maybeAsset) {
//   const filestoreHttp = useGlobalCtx().filestoreHttpDeployment
//   return useMemo(() => {
//     const defaultUrl = !defaultTo
//       ? undefined
//       : typeof defaultTo === 'string'
//         ? (defaultTo as url_string)
//         : defaultTo.type === 'none'
//           ? undefined
//           : defaultTo.type === 'external'
//             ? defaultTo.url
//             : defaultTo.type === 'stored'
//               ? getAssetUrl(defaultTo, filestoreHttp.href)
//               : unreachable_never(defaultTo)
//     const [url, credits] =
//       !asset || asset.type === 'none'
//         ? ([defaultUrl, undefined] as const)
//         : asset.type === 'stored'
//           ? ([getAssetUrl(asset, filestoreHttp.href), undefined] as const)
//           : asset.type === 'external'
//             ? ([asset.url, asset.credits] as const)
//             : unreachable_never(asset)

//     return [url, credits] as const
//   }, [asset, filestoreHttp.href, defaultTo])
// }

// export function useMyLinkedContent<linkType extends keyof linkedContent, contentType extends keyof linkedContent[linkType]>(
//   linkType: linkType,
//   contentType: contentType,
//   // contentType:linkedContent[linkType] extends infer linkTypeSection?keyof linkTypeSection:never,
//   contentId: string,
// ) {
//   const { session } = useMySession()
//   return useMemo(() => {
//     if (session.type === 'guest') {
//       return [false] as const
//     }
//     const list = session.moodlenetContributorRecord.linkedContent[linkType][contentType] as { id: string }[]
//     const linked = !!list.find(({ id }) => id === contentId)
//     const toggleActionType = linked ? 'remove' : 'add'
//     const toggleAction = async () => {
//       await session.myLinkedContent(linkType, contentType, contentId, toggleActionType)
//     }
//     return [linked] as const
//   }, [contentId, contentType, linkType, session])
// }
