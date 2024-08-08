import { ReactElement } from 'react'

export type SlotItem = string | ReactElement
export type Slots<K extends string = string> = Record<K, SlotItem[]>
export interface WebappConfig {
  mainLayout: {
    header: {
      slots: Slots<'left' | 'center' | 'right'>
    }
    footer: {
      slots: Slots<'left' | 'center' | 'right' | 'copyright'>
    }
  }
}
