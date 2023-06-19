import { getMyShell } from '@moodlenet/core'
import type { ResourceEvents } from './types.mjs'
export const shell = await getMyShell<void, ResourceEvents>(import.meta)
