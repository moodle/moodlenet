import { createContext } from 'react'
import { MainContextResource } from '../common/types.mjs'

export const MainContext = createContext<MainContextResource>(null as any)
