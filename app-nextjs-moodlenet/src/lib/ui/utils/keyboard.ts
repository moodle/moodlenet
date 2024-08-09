import { KeyboardEvent } from 'react'

export type KC = 'Enter'
export function isKC(key: KC, event: KeyboardEvent) {
  return event.code === key
}
