import { AllSchemaConfigs, makeAllPrimarySchemas } from '@moodle/domain'
import { appDeployments } from 'domain/src/env'
import { createContext, useContext } from 'react'

export const GlobalCtx = createContext<GlobalCtx>(null as any)
export type GlobalCtx = {
  deployments: appDeployments
  allSchemaConfigs: AllSchemaConfigs
}

function useGlobalCtx() {
  return useContext(GlobalCtx)
}
function useAllSchemaConfigs() {
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
