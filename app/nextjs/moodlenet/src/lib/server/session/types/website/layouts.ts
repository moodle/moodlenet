import { clientSlotItem } from '@/lib/common/pages'
import { ReactElement } from 'react'

type parallelRoute = string

export type layoutSlotItem = ReactElement | parallelRoute

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
    methods: { label: clientSlotItem; item: parallelRoute }[]
  }
  signup: {
    methods: { label: clientSlotItem; item: parallelRoute }[]
    slots: { subCard: layoutSlotItem[] }
  }
}
