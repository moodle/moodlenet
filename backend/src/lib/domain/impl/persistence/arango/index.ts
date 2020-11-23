import { nodeLogger } from '../../..'

export * as collections from './collections'
export * as persistence from './persistence'
export * as env from './domain.arango.env'
export const log = nodeLogger('Arango Persistence')
