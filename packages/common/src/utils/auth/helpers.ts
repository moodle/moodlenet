import { Id } from '../content-graph/id-key-type-guards'
export const getProfileIdByUsername = (username: string) => `Profile/${username}` as Id
