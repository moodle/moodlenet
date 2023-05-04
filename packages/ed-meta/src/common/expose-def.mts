import type { PkgExposeDef } from '@moodlenet/core'
export type EdMetaExposeType = PkgExposeDef<{
  rpc: Record<string, never>
  //rpc: {} // use this later
}>
