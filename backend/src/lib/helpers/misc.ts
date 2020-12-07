export const never = (more = '') => {
  throw new Error(`never ${more}`)
}

export const once = <F extends Function>(f: F): F => {
  const placeholder = Symbol()
  let ret: any = placeholder
  const fOnce = (((...args: any) => {
    if (ret === placeholder) {
      ret = f(...args)
    }
    return ret
  }) as any) as F
  return fOnce
}
