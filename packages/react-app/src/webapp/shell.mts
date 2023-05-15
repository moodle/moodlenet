import type { MyWebAppDeps } from '../common/exports.mjs'
import { getMyShell } from './getMyShell.mjs'

export const shell = getMyShell<MyWebAppDeps>()
