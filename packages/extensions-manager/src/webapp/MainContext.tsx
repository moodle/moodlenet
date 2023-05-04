import { createContext } from 'react'
import type { MainContextType } from './types.mjs'

export const MainContext = createContext<MainContextType>(null as never)
