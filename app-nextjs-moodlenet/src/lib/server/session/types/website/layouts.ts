import { clientSlotItem } from '@/lib/common/pages'
import { ReactElement } from 'react'

export type layoutSlotItem = ReactElement | string

export interface Layouts {
  pages: PageLayouts
  roots: RootLayouts
}

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

export interface PageLayouts {
  landing: {
    slots: { head: layoutSlotItem[]; content: layoutSlotItem[] }
  }
  login: {
    methods: { label: clientSlotItem; item: string }[]
  }
  signup: {
    methods: { label: clientSlotItem; item: string }[]
    slots: { subCard: layoutSlotItem[] }
  }
}
