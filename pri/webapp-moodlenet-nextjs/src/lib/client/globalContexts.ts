import { AllSchemaConfigs } from '@moodle/domain'
import { makeAllPrimarySchemas } from '@moodle/domain/lib'
import { asset, getAssetUrl } from '@moodle/module/storage'
import { appDeployments } from 'domain/src/modules/env'
import { createContext, useContext, useMemo } from 'react'

export const GlobalCtx = createContext<GlobalCtx>(null as any)
export type GlobalCtx = {
  deployments: appDeployments
  allSchemaConfigs: AllSchemaConfigs
}

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

export function useAsset(asset: asset) {
  const { filestoreHttp } = useDeployments()
  return useMemo(() => {
    const url = getAssetUrl(asset, filestoreHttp.href)
    return [url]
  }, [asset, filestoreHttp.href])
}
