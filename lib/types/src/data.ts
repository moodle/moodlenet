export type __obfuscated__<T> = {
  __obfuscated__: T
}

export type _t<t> = { [k in string & keyof t]: t[k] }
