import { SessionEnv } from '@moodlenet/common/dist/types'

export type Context = {
  sessionEnv: SessionEnv
}

export type RootValue = Record<string, never>
