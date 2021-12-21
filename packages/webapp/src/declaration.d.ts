declare module '*.scss'
declare module '*.css'
interface Window {
  __MN_ENV__?: {
    minResourcesForUserApprovalRequests?: string
    timeBetweenApprovalRequests?: string
    graphqlEndpoint?: string
    staticAssetBase?: string
  }
}
