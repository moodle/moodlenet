import { makeAllPrimarySchemas } from '@moodle/domain/lib'
import { _nullish, unreachable_never, url_path_string, url_string } from '@moodle/lib-types'
import { webappGlobals } from '@moodle/module/moodlenet-react-app'
import { asset } from '@moodle/module/storage'
import { getAssetUrl } from '@moodle/module/storage/lib'
import { createContext, useContext, useMemo } from 'react'
// import { getUserLevelDetails } from './user-levels/lib'
// import { linkedContent } from '@moodle/module/moodlenet'

export const GlobalCtx = createContext<webappGlobals>(null as any)

function useGlobalCtx() {
  return useContext(GlobalCtx)
}
// export function useSiteInfo() {
//   return useGlobalCtx().moodlenetSiteInfo
// }
export function useAllSchemaConfigs() {
  return useGlobalCtx().allSchemaConfigs
}
export function useFileServerDeployment() {
  return useGlobalCtx().filestoreHttpDeployment
}

export function usePointSystem() {
  const { /* session,  */ pointSystem } = useGlobalCtx()
  // const myPoints = session.type === 'authenticated' ? session.moodlenetContributorRecord.stats.points : 0
  return useMemo(() => {
    // const myUserLevelDetails = getUserLevelDetails(pointSystem, myPoints)
    return { pointSystem /* , myUserLevelDetails */ }
  }, [pointSystem /* , myPoints */])
}
// export function useMySession() {
//   const { session } = useGlobalCtx()
//   return useMemo(() => {
//     return { session }
//   }, [session])
// }

export function useAllPrimarySchemas() {
  const allSchemaConfigs = useAllSchemaConfigs()
  const primarySchemas = makeAllPrimarySchemas(allSchemaConfigs)
  return primarySchemas
}

export function useAssetUrl(asset: asset | _nullish, defaultTo?: string | asset) {
  const filestoreHttp = useFileServerDeployment()
  return useMemo(() => {
    const defaultUrl = !defaultTo
      ? undefined
      : typeof defaultTo === 'string'
        ? (defaultTo as url_string)
        : defaultTo.type === 'none'
          ? undefined
          : defaultTo.type === 'external'
            ? defaultTo.url
            : defaultTo.type === 'local'
              ? getAssetUrl(defaultTo, filestoreHttp.href)
              : unreachable_never(defaultTo)
    const [url, credits] =
      !asset || asset.type === 'none'
        ? ([defaultUrl, undefined] as const)
        : asset.type === 'local'
          ? ([getAssetUrl(asset, filestoreHttp.href), undefined] as const)
          : asset.type === 'external'
            ? ([asset.url, asset.credits] as const)
            : unreachable_never(asset)

    return [url, credits] as const
  }, [asset, filestoreHttp.href, defaultTo])
}

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
