import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'
type RefT<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null

export function useForwardedRef<T>(ref: RefT<T>) {
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
