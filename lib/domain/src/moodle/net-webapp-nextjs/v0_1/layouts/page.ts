import { layoutSlotItem } from '../types'

export interface PageLayouts {
  landing: {
    slots: { head: layoutSlotItem[]; content: layoutSlotItem[] }
  }
  login: {
    methods: { label: layoutSlotItem; panel: layoutSlotItem }[]
  }
  signup: {
    methods: { label: layoutSlotItem; panel: layoutSlotItem }[]
    slots: { subCard: layoutSlotItem[] }
  }
}
