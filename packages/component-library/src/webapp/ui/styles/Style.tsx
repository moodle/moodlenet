import type { CSSProperties } from 'react'
import { createContext } from 'react'
import type { BaseStyleType } from '../../../common/config.js'
import { baseStyle } from '../../../common/config.js'

export type StyleContextType = {
  style: BaseStyleType & CSSProperties
  setStyle: (style: BaseStyleType & CSSProperties) => unknown
}

const StyleContextDefault = {
  style: {
    ...baseStyle(),
  },
  setStyle: () => {},
}
const StyleContext = createContext<StyleContextType>(StyleContextDefault)
export const StyleProvider = StyleContext.Provider
export default StyleContext
