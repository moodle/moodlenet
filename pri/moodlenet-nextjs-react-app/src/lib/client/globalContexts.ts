import { makeAllPrimarySchemas } from '@moodle/domain/lib'
import { _nullish, url_path_string } from '@moodle/lib-types'
import { webappGlobalCtx } from '@moodle/module/moodlenet-react-app'
import { asset } from '@moodle/module/storage'
import { getAssetUrl } from '@moodle/module/storage/lib'
import { createContext, useContext, useMemo } from 'react'

export const GlobalCtx = createContext<webappGlobalCtx>(null as any)

function useGlobalCtx() {
  return useContext(GlobalCtx)
}
export function useAllSchemaConfigs() {
  return useGlobalCtx().allSchemaConfigs
}
export function useDeployments() {
  return useGlobalCtx().deployments
}

export function useAllPrimarySchemas() {
  const allSchemaConfigs = useAllSchemaConfigs()
  const primarySchemas = makeAllPrimarySchemas(allSchemaConfigs)
  return primarySchemas
}

export function useAssetUrl(asset: asset | _nullish, defaultTo?: string) {
  const { filestoreHttp } = useDeployments()
  return useMemo(() => {
    const url = asset ? getAssetUrl(asset, filestoreHttp.href) : (defaultTo as url_path_string | undefined)
    return [url] as const
  }, [asset, filestoreHttp.href, defaultTo])
}
