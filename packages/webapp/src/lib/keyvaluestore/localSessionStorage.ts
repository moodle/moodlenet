import { KVStore, CreateKVStore } from './types';

type Type = 'session' | 'local';
export const SESSION: Type = 'session';
export const LOCAL: Type = 'local';
export const createLocalSessionKVStorage = (type: Type): CreateKVStore => (
  prefix = ''
): KVStore => {
  const storage = type === 'local' ? localStorage : sessionStorage;
  const pkey = (key: string) => `${prefix}${key}`;
  const get: KVStore['get'] = key => parse(storage.getItem(pkey(key)), type, pkey(key));
  const set: KVStore['set'] = (key, val) => storage.setItem(pkey(key), serialize(val));
  const del: KVStore['del'] = key => {
    const val = get(pkey(key));
    storage.removeItem(pkey(key));
    return val;
  };
  return {
    get,
    set,
    del
  };
};

const parse = (str: string | null, type: Type, key: string): any => {
  if (str === null) {
    return null;
  }
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn(`KVStore[${type}]#parse: could not parse ${str} at key [${key}]`);
    return null;
  }
};
const serialize = (val: any) => JSON.stringify(val);
