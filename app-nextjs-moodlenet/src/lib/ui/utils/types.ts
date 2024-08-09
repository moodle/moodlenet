import { ReactNode } from 'react'

export type UiSlots<k extends string> = Partial<Record<k, ReactNode[]>>
