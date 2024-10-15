import { layoutSlotItem } from '../slots'

export interface RootLayouts {
  main: {
    header: {
      slots: { left: layoutSlotItem[]; center: layoutSlotItem[]; right: layoutSlotItem[] }
    }
    footer: {
      slots: {
        left: layoutSlotItem[]
        center: layoutSlotItem[]
        right: layoutSlotItem[]
        bottom: layoutSlotItem[]
      }
    }
  }
  simple: {
    header: {
      slots: { left: layoutSlotItem[]; center: layoutSlotItem[]; right: layoutSlotItem[] }
    }
    footer: {
      slots: {
        left: layoutSlotItem[]
        center: layoutSlotItem[]
        right: layoutSlotItem[]
        bottom: layoutSlotItem[]
      }
    }
  }
}
