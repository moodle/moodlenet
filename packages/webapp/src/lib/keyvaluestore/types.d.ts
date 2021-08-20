type Key = string;
type Val = any;
export interface KVStore {
  set(key: Key, val: Val): void;
  get(key: Key): Val;
  del(key: Key): Val;
}
export interface CreateKVStore {
  (prefix?: string): KVStore;
}
