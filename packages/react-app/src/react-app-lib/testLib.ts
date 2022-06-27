import { createContext, useContext } from 'react'

export type TestCtxT = {
  _: string
}

export const TestCtx = createContext<TestCtxT>(null as any)
export function useTest(_: string) {
  const testCtx = useContext(TestCtx)
  return [_, testCtx._]
}
