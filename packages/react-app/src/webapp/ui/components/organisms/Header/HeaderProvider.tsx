import React, { createContext, useState } from 'react'

export type HeaderContextType = null | { devMode: boolean; setDevMode: React.Dispatch<React.SetStateAction<boolean>> }

export const HeaderContext = createContext<null | HeaderContextType>(null)

export const StateProvider = ({ children }: { children: any }) => {
  const [devMode, setDevMode] = useState(false)

  return (
    <HeaderContext.Provider value={{ devMode: devMode, setDevMode: setDevMode }}>{children}</HeaderContext.Provider>
  )
}

// export const useContextState = () => {
//   const state = useContext(StateContext)
//   const setState = useContext(SetStateContext)
//   if (setState === null) throw new Error()
//   return { state, setState } // setBookedBatch: React.Dispatch<React.SetStateAction<State>>
// }

// const App = () => {
//   const { setBookedBatch } = useContextState()
//   useEffect(() => { setBookedBatch({ id: "foo" }) }, [])
// }

// const { setBookedBatch } = useContextState()
