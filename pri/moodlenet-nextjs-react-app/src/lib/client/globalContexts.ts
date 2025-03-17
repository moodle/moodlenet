import { any_ } from '@moodle/lib-types'
import { createContext, useContext } from 'react'
export type sessionContext = {
  permissionsInfo: moo.permissions.user.info
}

// import { getUserLevelDetails } from './user-levels/lib'
// import { linkedContent } from '@moodle/module/moodlenet'
type webappGlobals = unknown
export type globalCtx = webappGlobals & { session: sessionContext }
export const GlobalCtx = createContext<globalCtx>(null as any_)

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
