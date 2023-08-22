import type { PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'

export type MyModerationsContextT = { a: null }

export const MyModerationsContext = createContext<MyModerationsContextT>(null as any)

export function MyModerationsContextProvider({ children }: PropsWithChildren<unknown>) {
  // const [myLmsWebUserConfig, setMyLmsWebUserConfig] = useState<LmsWebUserConfig>()
  // const auth = useContext(AuthCtx)
  // // const canSend = !!auth.clientSessionData?.myProfile
  // useEffect(() => {
  //   if (!auth.clientSessionData) return
  //   shell.rpc.me('webapp/get-my-config')().then(setMyLmsWebUserConfig)
  // }, [auth.clientSessionData])

  const ctx = useMemo<MyModerationsContextT>(() => ({ a: null }), [])
  return <MyModerationsContext.Provider value={ctx}>{children}</MyModerationsContext.Provider>
}
