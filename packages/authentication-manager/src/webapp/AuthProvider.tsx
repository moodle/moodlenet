import { ExtContextProviderComp } from '@moodlenet/react-app'
import { createContext } from 'react'

export type AuthCtxT = { xx: string }
export const AuthCtx = createContext<AuthCtxT>(null as any as AuthCtxT)

export const AuthCtxProvider: ExtContextProviderComp = ({ children }) => {
  return <AuthCtx.Provider value={{ xx: 'cicci' }}>{children}</AuthCtx.Provider>
}

export default AuthCtxProvider
