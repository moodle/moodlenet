import { KeyboardEvent } from 'react'

export type keyCodes = 'Enter' | 'NumpadEnter'
export function isKC(event: KeyboardEvent, key: keyCodes) {
  return event.code === key
}
export function isEnterKeyEv(event: KeyboardEvent) {
  return isKC(event, 'Enter') || isKC(event, 'NumpadEnter')
}
