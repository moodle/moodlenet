import type { FC } from 'react'
import { Advanced } from './Advanced'
import { useAdvancedProps } from './AdvancedHooks'

export const AdvancedContainer: FC = () => {
  const AdvancedProps = useAdvancedProps()
  return <Advanced {...AdvancedProps} />
}
