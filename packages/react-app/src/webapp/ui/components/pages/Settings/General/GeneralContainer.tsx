import type { FC } from 'react'
import { General } from './General.js'
import { useGeneralProps } from './GeneralHooks.js'

export const GeneralContainer: FC = () => {
  const generalProps = useGeneralProps()
  return <General {...generalProps} />
}
