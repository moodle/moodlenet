import { jsx as _jsx } from 'react/jsx-runtime'
import { useState } from 'react'
import './Switch.scss'
export const Switch = ({ className, enabled, mandatory, size, onClick, onMouseDown }) => {
  const [localEnabled, setLocalEnabled] = useState(enabled)
  const [animation, setAnimation] = useState(undefined)
  return _jsx('div', {
    className: `switch ${className ? className : ''}  ${
      /* enabled */ localEnabled ? 'on' : 'off'
    } ${mandatory ? 'disabled' : ''} ${size} `,
    // onClick={onClick}
    onClick: () => {
      onClick && onClick()
      setLocalEnabled(p => {
        setAnimation(p ? 'to-off' : 'to-on')
        return !p
      })
    },
    onMouseDown: onMouseDown,
    children: _jsx('div', {
      className: `moving-part ${animation} ${/* enabled */ localEnabled ? 'on' : 'off'} ${size}`,
    }),
  })
}
Switch.defaultProps = {
  size: 'big',
}
export default Switch
//# sourceMappingURL=Switch.js.map
