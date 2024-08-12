import { plugins } from 'lib/common/utils/plugins'
import { ReactElement } from 'react'

export type slotItem = string | ReactElement
export type layoutSlots<k extends string = string, t = slotItem> = plugins<k, t>
