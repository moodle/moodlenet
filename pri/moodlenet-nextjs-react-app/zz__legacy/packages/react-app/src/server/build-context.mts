import { env } from './init/env.mjs'
import { getBuildContext } from './webpack/get-build-context.mjs'

export const buildContext = getBuildContext({ baseBuildFolder: env.baseBuildFolder })
