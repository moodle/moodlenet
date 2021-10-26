export const PUBLIC_URL = process.env.PUBLIC_URL
export const NODE_ENV = process.env.NODE_ENV
export const isProduction = process.env.NODE_ENV !== 'production'

export const STATIC_ASSET_BASE = window.__MN_ENV__?.staticAssetBase || '/assets'
export const GRAPHQL_ENDPOINT = window.__MN_ENV__?.graphqlEndpoint || '/graphql'

console.log(`ENV:`, { process: process.env, mnEnv: window.__MN_ENV__ })
