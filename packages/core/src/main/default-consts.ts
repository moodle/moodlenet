import { NpmRegistry } from '../types/sys'

export const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org/'
export const getRegistry = (_reg?: string | undefined): NpmRegistry => _reg ?? DEFAULT_NPM_REGISTRY
