import { useContext } from 'react'
import { AuthCtx } from './AuthProvider'

export function useAuthValue() {
  const ctx = useContext(AuthCtx)
  return ctx.xx
}
