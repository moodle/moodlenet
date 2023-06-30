import { getBuildContext } from './get-build-context.mjs'
import { env } from './init/env.mjs'

export const buildContext = getBuildContext({ baseBuildFolder: env.baseBuildFolder })
