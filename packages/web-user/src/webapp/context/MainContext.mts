import { createContext } from 'react'
import type { MyPkgContext } from '../../common/exports.mjs'
import type { MainRegistries } from '../registries.mjs'

export type MainContextT = MyPkgContext & {
  registries: MainRegistries
}

export const MainContext = createContext<MainContextT>(null as never)
