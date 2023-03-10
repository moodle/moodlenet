import type { getMyShell } from './shell.mjs'
export type Shell<T = any> = Awaited<ReturnType<typeof getMyShell<T>>>
