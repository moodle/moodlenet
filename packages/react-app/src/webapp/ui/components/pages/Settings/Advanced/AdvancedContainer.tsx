import { FC } from 'react'
import { Advanced } from './Advanced.js'
import { useAdvancedProps } from './AdvancedHooks.js'

export const AdvancedContainer: FC = () => {
  const AdvancedProps = useAdvancedProps()
  return <Advanced {...AdvancedProps} />
}
