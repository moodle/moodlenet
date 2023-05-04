import { createContext } from 'react'
import type { MainContextCollection } from '../common/types.mjs'

export const MainContext = createContext<MainContextCollection>(null as any)
