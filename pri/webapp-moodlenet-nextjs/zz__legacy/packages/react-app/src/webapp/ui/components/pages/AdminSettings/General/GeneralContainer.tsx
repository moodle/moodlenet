import type { FC } from 'react'
import { General } from './General'
import { useGeneralProps } from './GeneralHooks'

export const GeneralContainer: FC = () => {
  const generalProps = useGeneralProps()
  return <General {...generalProps} />
}
