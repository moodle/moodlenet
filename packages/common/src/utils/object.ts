import { isJust } from './array'

export const mapObjProps = <K extends string, V, MV>(source: Record<K, V>, mapper: (v: V, k: K) => MV): Record<K, MV> =>
  Object.keys(source).reduce((_mapped, _key) => {
    const key = _key as K
    const val = source[key]
    return { ..._mapped, [key]: mapper(val, key) }
  }, {} as Record<K, MV>)

export const filterObjProps = <K extends string, FK extends K, V, FV extends V>(
  source: Record<K, V>,
  filter: (v: V, k: K) => v is FV,
): Partial<Record<FK, FV>> =>
  Object.keys(source).reduce((_filtered, _key) => {
    const key = _key as K
    const val = source[key]
    return filter(val, key) ? { ..._filtered, [key]: val } : _filtered
  }, {} as Partial<Record<FK, FV>>)

export const filterNullVoidProps = <V>(source: Record<string, V>): Record<string, Exclude<V, null | undefined>> =>
  filterObjProps(source, isJust) as Record<string, Exclude<V, null | undefined>>
