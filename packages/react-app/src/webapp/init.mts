import type { MyWebAppDeps } from '../common/exports.mjs'
import { getMyShell } from './exports/webapp.mjs'

export const shell = getMyShell<MyWebAppDeps>()
