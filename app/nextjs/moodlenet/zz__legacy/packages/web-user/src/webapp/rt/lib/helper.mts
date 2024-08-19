// @ALE move where ??
export const objectMap = <T, V>(obj: T, fn: (val: T[keyof T], key: keyof T) => V) =>
  Object.entries(obj as Record<keyof T, V>).reduce(
    (acc, [key, val]) => ((acc[key as keyof T] = fn(val as T[keyof T], key as keyof T)), acc),
    {} as Record<keyof T, V>,
  )
