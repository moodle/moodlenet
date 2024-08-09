import { plugins } from 'lib/common/utils/plugins'
import { ReactElement } from 'react'

export type slotItem = string | ReactElement
export type layoutSlots<k extends string = string, t = slotItem> = plugins<k, t>

export interface WebappConfig {
  title: string
  subtitle: string
  basePath: string
  logo: string
  smallLogo: string
  labels: {
    searchPlaceholder: string
  }
  landing: {
    slots: layoutSlots<'head' | 'content'>
  }
  mainLayout: {
    header: {
      slots: layoutSlots<'left' | 'center' | 'right'>
    }
    footer: {
      slots: layoutSlots<'left' | 'center' | 'right' | 'copyright'>
    }
  }
}
