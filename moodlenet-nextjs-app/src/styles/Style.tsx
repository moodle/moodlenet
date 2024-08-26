import type { CSSProperties } from 'react'
import { createContext } from 'react'
import { baseStyle, BaseStyleType } from '../common/config'
// import type { BaseStyleType } from '../../../../common/config.jsx';
// import { baseStyle } from '../../../../common/config.jsx';

export type StyleContextType = {
  style: BaseStyleType & CSSProperties
  setStyle: (style: BaseStyleType & CSSProperties) => unknown
}

const StyleContextDefault = {
  style: {
    ...baseStyle(),
  },
  setStyle: () => {
    return
  },
}
const StyleContext = createContext<StyleContextType>(StyleContextDefault)
export const StyleProvider = StyleContext.Provider
export default StyleContext
