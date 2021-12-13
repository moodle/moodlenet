export const PUBLIC_URL = process.env.PUBLIC_URL
export const NODE_ENV = process.env.NODE_ENV
export const isProduction = process.env.NODE_ENV !== 'production'

export const STATIC_ASSET_BASE = window.__MN_ENV__?.staticAssetBase || '/assets'
export const GRAPHQL_ENDPOINT = window.__MN_ENV__?.graphqlEndpoint || '/graphql'
export const TIME_BETWEEN_USER_APPROVAL_REQUESTS = Number(
  window.__MN_ENV__?.timeBetweenApprovalRequests || 1000 * 60 * 60 * 24 * 14
)
export const MIN_RESOURCES_FOR_USER_APPROVAL_REQUESTS = Number(
  window.__MN_ENV__?.minResourcesForUserApprovalRequests || 5
)

console.log(`ENV:`, { process: process.env, mnEnv: window.__MN_ENV__ })
