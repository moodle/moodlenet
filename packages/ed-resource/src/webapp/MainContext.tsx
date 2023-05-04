import { createContext } from 'react'
import type { MainContextResource } from '../common/types.mjs'

export const MainContext = createContext<MainContextResource>(null as any)
