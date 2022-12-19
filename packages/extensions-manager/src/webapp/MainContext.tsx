import { createContext } from 'react'
import { MainContextType } from './types.mjs'

export const MainContext = createContext<MainContextType>(null as never)
