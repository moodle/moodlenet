import { BaseStyleType } from '@moodlenet/component-library'
import { CSSProperties } from 'react'
export type CustomStyleType = BaseStyleType & CSSProperties
export type AppearanceData = {
  color: string
  logo: string
  smallLogo: string
  //TODO: decide if having this as optional
  customStyle?: CustomStyleType
}
