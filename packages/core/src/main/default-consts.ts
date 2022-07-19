import { NpmRegistry } from '../types/sys'

const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org'
export const getRegistry = (_reg?: string | undefined): NpmRegistry =>
  _reg ?? process.env.NPM_CONFIG_REGISTRY ?? DEFAULT_NPM_REGISTRY
