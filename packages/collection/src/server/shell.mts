import { getMyShell } from '@moodlenet/core'
import type { CollectionEvents } from './types.mjs'
export const shell = await getMyShell<unknown, CollectionEvents>(import.meta)
