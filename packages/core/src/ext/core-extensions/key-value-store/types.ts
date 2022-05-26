import { ExtDef, SubTopo } from '@moodlenet/kernel'

export type MoodlenetKeyValueStoreExt = ExtDef<
  'moodlenet.key-value-store',
  '0.1.10',
  {
    get: SubTopo<{ storeName: string; key: string }, any>
    put: SubTopo<{ storeName: string; key: string; val: any }, { old: any | undefined }>
    create: SubTopo<{ storeName: string }, void>
    exists: SubTopo<{ storeName: string }, boolean>
  }
>

export type MoodlenetKeyValueStoreLib<KVMap> = {
  get<K extends string & keyof KVMap>(key: K): Promise<KVMap[K] | undefined>
  put<K extends string & keyof KVMap>(
    key: K,
    val: KVMap[K],
  ): Promise<{
    old: KVMap[K] | undefined
  }>
  create(): Promise<void>
  exists(): Promise<boolean>
}
