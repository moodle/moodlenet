import { MoodleNet } from '../..'

export type ContentGraphRoutes = 'query' | 'ContentGraph-GraphQL-Request'
export const contentGraphRoutes = MoodleNet.routes<ContentGraphRoutes>()
