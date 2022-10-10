import { createContext } from 'react'
import { baseStyle } from './config.js'
const StyleContextDefault = {
  style: {
    ...baseStyle(),
  },
  setStyle: () => {},
}
const StyleContext = createContext(StyleContextDefault)
export const StyleProvider = StyleContext.Provider
export default StyleContext
//# sourceMappingURL=Style.js.map
