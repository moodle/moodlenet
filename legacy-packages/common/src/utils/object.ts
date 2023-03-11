import { DistOmit } from './types'

export const pick = <T, K extends keyof T>(o: T, ks: K[]): Required<Pick<T, K>> =>
  ks.reduce((_, k) => ({ ..._, [k]: o[k] }), {} as any) //{ [k in K]-?: T[K] }

export const omit = <T, K extends keyof T>(o: T, ks: K[]): DistOmit<T, K> => {
  const pickKeys = Object.keys(o).filter(k => !ks.includes(k as any)) as any
  return pick(o, pickKeys) as any
}

//todo: all functions here have some typing issues .
// check if|how to keep those utilities

// export const mapObjProps = <K extends string, V, MV>(source: Record<K, V>, mapper: (v: V, k: K) => MV): Record<K, MV> =>
//   Object.keys(source).reduce((_mapped, _key) => {
//     const key = _key as K
//     const val = source[key]
//     return { ..._mapped, [key]: mapper(val, key) }
//   }, {} as Record<K, MV>)

// export const filterObjProps = <K extends string, FK extends K, V, FV extends V, S extends { [k in K]: V }>(
//   source: S,
//   filter: (v: V, k: K) => v is FV,
// ): Partial<{ [k in FK]: FV }> =>
//   Object.keys(source).reduce((_filtered, _key) => {
//     const key = _key as K
//     const val = source[key]
//     return filter(val, key) ? { ..._filtered, [key]: val } : _filtered
//   }, {} as Partial<Record<FK, FV>>)

// export const promisePropsAll = async <O extends { [k: string]: any }>(
//   obj: O,
// ): Promise<{ [k in keyof O]: O[k] extends Promise<infer T> ? T : O[k] }> => {
//   const keys = Object.keys(obj) as (keyof O)[]
//   const allValues = await Promise.all(keys.map(key => obj[key]))
//   return keys.reduce(
//     (_mapped, key, index) => ({
//       ..._mapped,
//       [key]: allValues[index],
//     }),
//     {} as any,
//   )
// }
// export const filterNullVoidProps = <V>(source: Record<string, V>): Record<string, Exclude<V, null | undefined>> =>
//   filterObjProps(source, isJust) as Record<string, Exclude<V, null | undefined>>
