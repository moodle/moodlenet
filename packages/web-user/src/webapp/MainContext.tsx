import { createContext } from 'react'
import { MainContextT } from './types.mjs'

export const MainContext = createContext<MainContextT>(null as any)
