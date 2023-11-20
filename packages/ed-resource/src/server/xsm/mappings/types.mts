import type { ResourceDataType } from '../../types.mjs'

export type ResourceDataTypeMeta = Omit<
  ResourceDataType,
  'image' | 'content' | 'published' | 'persistentContext' | 'popularity'
>
