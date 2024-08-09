export type SomeOf<T, k extends keyof T = keyof T> = {
  [_k in k]: T[_k] & { t: _k }
}[k]
