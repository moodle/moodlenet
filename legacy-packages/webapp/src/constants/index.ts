export const PUBLIC_URL = process.env.PUBLIC_URL
export const NODE_ENV = process.env.NODE_ENV
export const isProduction = process.env.NODE_ENV !== 'production'

export const STATIC_ASSET_BASE = window.__MN_ENV__.staticAssetBase
export const GRAPHQL_ENDPOINT = window.__MN_ENV__.graphqlEndpoint
export const UNSPLASH_ENDPOINT = window.__MN_ENV__.unsplashEndpoint
export const TIME_BETWEEN_USER_APPROVAL_REQUESTS =
  window.__MN_ENV__.timeBetweenApprovalRequests

export const MIN_RESOURCES_FOR_USER_APPROVAL_REQUESTS =
  window.__MN_ENV__.minResourcesForUserApprovalRequests

export const MNEnv = window.__MN_ENV__

// console.log(`ENV:`, { process: process.env, mnEnv: window.__MN_ENV__ })
