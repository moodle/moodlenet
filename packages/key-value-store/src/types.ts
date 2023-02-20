export type KVSTypeMap = Record<string, any>
export type ValueObj<T = any> = { value: undefined | T }
export type KVStore<TMap extends KVSTypeMap> = {
  get<Type extends string & keyof TMap>(type: Type, key: string): Promise<ValueObj<TMap[Type]>>
  set<Type extends string & keyof TMap>(type: Type, key: string, val: TMap[Type]): Promise<void>
  unset<Type extends string & keyof TMap>(type: Type, key: string): Promise<void>
}
