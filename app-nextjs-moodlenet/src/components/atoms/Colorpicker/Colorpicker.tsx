"use client"
import type { ChangeEvent, FC } from 'react'
import { useEffect, useRef } from 'react'
import './Colorpicker.scss'

export type ColorpickerProps = {
  // onChange: ChangeEventHandler<HTMLInputElement>
} & React.InputHTMLAttributes<HTMLInputElement>

export const Colorpicker: FC<ColorpickerProps> = ({
  // onChange,
  ...fieldProps
}) => {
  const colorpicker = useRef<HTMLInputElement>(null)

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

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (fieldProps.onChange) {
      const event = {
        currentTarget: {
          value: e.currentTarget.value.toUpperCase(),
        },
      } as ChangeEvent<HTMLInputElement>
      fieldProps.onChange(event)
    }
  }

  return (
    <input
      type="color"
      id="colorpicker"
      ref={colorpicker}
      value={fieldProps.value}
      {...fieldProps}
      onChange={e => handleOnChange(e)}
    />
  )
}

Colorpicker.defaultProps = {
  checked: false,
}

export default Colorpicker
