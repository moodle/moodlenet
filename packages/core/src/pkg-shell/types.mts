import type { shell } from './shell.mjs'
export type Shell = Awaited<ReturnType<typeof shell>>
