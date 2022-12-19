import { createContext } from 'react'
import { GuestMainRegistries } from '../registries.mjs'

export type ReactAppContextT = {
  registries: GuestMainRegistries
}
export const ReactAppContext = createContext<ReactAppContextT>(null as never)
