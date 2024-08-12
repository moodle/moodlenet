import { ReactElement } from 'react'
import { layoutSlotItem } from '../misc'

export type ReactNodeSer = ReactElement | string | number | ReactNodeSer[]

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
    methods: { label: ReactNodeSer; item: string }[]
  }
}
