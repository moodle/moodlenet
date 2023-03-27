import { createContext } from 'react'
import { MainContextResourceType } from '../common/types.mjs'

export const MainContext = createContext<MainContextResourceType>(null as any)
