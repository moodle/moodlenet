import type { getMyShell } from './shell.mjs'
export type Shell = Awaited<ReturnType<typeof getMyShell>>
