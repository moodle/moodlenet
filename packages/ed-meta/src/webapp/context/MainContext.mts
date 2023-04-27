import { createContext } from 'react'
import { MyPkgContext } from '../../common/exports.mjs'

export type MainContextT = MyPkgContext /*  & {
} */

export const MainContext = createContext<MainContextT>(null as never)
