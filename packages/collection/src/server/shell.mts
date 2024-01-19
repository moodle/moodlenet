import { getMyShell } from '@moodlenet/core'
import type { CollectionEvents } from './types.mjs'
export * from '@moodlenet/ed-resource/server'
export const shell = await getMyShell<unknown, CollectionEvents>(import.meta)
