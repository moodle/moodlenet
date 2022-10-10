import { jsx as _jsx } from 'react/jsx-runtime'
import { useEffect, useRef } from 'react'
import './Colorpicker.scss'
export const Colorpicker = ({
  // onChange,
  ...fieldProps
}) => {
  const colorpicker = useRef(null)
  useEffect(() => {
    const setColor = () => {
      colorpicker.current?.style.setProperty('--color', colorpicker.current.value.toUpperCase())
    }
    window.addEventListener('input', setColor)
    return () => window.removeEventListener('input', setColor)
  }, [colorpicker])
  useEffect(() => {
    typeof fieldProps.value === 'string' &&
      colorpicker.current?.style.setProperty('--color', fieldProps.value)
  }, [fieldProps.value])
  const handleOnChange = e => {
    if (fieldProps.onChange) {
      const event = {
        currentTarget: {
          value: e.currentTarget.value.toUpperCase(),
        },
      }
      fieldProps.onChange(event)
    }
  }
  return _jsx('input', {
    type: 'color',
    id: 'colorpicker',
    ref: colorpicker,
    value: fieldProps.value,
    ...fieldProps,
    onChange: e => handleOnChange(e),
  })
}
Colorpicker.defaultProps = {
  checked: false,
}
export default Colorpicker
//# sourceMappingURL=Colorpicker.js.map
