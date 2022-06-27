import React, { createContext, useState } from 'react'

export type StateContextType = null | { devMode: boolean; setDevMode: React.Dispatch<React.SetStateAction<boolean>> }

export const StateContext = createContext<null | StateContextType>(null)

export const StateProvider = ({ children }: { children: any }) => {
  const [devMode, setDevMode] = useState(false)

  return <StateContext.Provider value={{ devMode: devMode, setDevMode: setDevMode }}>{children}</StateContext.Provider>
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
