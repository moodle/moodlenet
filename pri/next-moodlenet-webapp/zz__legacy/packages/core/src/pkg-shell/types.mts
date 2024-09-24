import type { getMyShell } from './shell.mjs'
export type Shell<A = never, E = never> = Awaited<ReturnType<typeof getMyShell<A, E>>>
