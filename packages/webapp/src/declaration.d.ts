declare module '*.scss'
declare module '*.css'
interface Window {
  __MN_ENV__?: {
    graphqlEndpoint?: string
    staticAssetBase?: string
  }
}
