import { ReactElement } from 'react'

export type SlotItem = string | ReactElement
export interface WebappConfig {
  mainLayout: {
    header: {
      slots: {
        left: SlotItem[]
        center: SlotItem[]
        right: SlotItem[]
      }
    }
    footer: {
      slots: {
        left: SlotItem[]
        center: SlotItem[]
        right: SlotItem[]
        copyright: SlotItem[]
      }
    }
  }
}
