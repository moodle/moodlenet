import { createContext, CSSProperties } from 'react'
import { baseStyle, BaseStyleType } from './config.js'

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
