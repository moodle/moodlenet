import { createContext } from 'react'
import type { MainContextT } from './types.mjs'

export const MainContext = createContext<MainContextT>(null as any)
