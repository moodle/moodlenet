import { getMyShell } from '@moodlenet/core'

export const shell = await getMyShell<unknown>(import.meta)
