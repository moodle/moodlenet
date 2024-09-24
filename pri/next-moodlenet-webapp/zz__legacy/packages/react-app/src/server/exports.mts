import { env } from './init/env.mjs'

export { getAppearance, getWebappUrl, plugin, setAppearance, webImageResizer } from './lib.mjs'
export { registerOpenGraphProvider } from './opengraph.mjs'
export const defaultImageUploadMaxSize = env.defaultImageUploadMaxSize
