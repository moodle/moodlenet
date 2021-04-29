export const NODE_ENV = process.env.NODE_ENV
export const PUBLIC_URL = process.env.PUBLIC_URL

export const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT
export const STATIC_ASSET_BASE = process.env.REACT_APP_STATIC_ASSET_BASE || ''

export const isProduction = process.env.NODE_ENV !== 'production'

console.log(`ENV:`, process.env)
