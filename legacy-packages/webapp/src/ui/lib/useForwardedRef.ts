import { MutableRefObject, useEffect, useRef } from 'react'
type RefT<T> =
  | ((instance: T | null) => void)
  | MutableRefObject<T | null>
  | null

export const useForwardedRef = <T>(ref: RefT<T>) => {
  const innerRef = useRef<T>(null)
  useEffect(() => {
    if (!ref) return
    if (typeof ref === 'function') {
      ref(innerRef.current)
    } else {
      ref.current = innerRef.current
    }
  })

  return innerRef
}
