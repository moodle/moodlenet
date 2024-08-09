import { ReactElement } from 'react'

export type SlotItem = string | ReactElement
export type Slots<K extends string = string> = Record<K, SlotItem[]>
export interface WebappConfig {
  title: string
  subtitle: string
  user: {
    permissions: {
      createDraftContent?: boolean
    }
  }
  labels: {
    searchPlaceholder: string
  }
  landing: {
    slots: Slots<'head' | 'content'>
  }
  mainLayout: {
    header: {
      slots: Slots<'left' | 'center' | 'right'>
    }
    footer: {
      slots: Slots<'left' | 'center' | 'right' | 'copyright'>
    }
  }
}
