/* eslint-disable prettier/prettier */
import type { AddonItem } from '@moodlenet/component-library'
import { Card, SnackbarStack } from '@moodlenet/component-library'
import type { FC } from 'react'
import './General.scss'

export type GeneralProps = {
  mainColumnItems: (AddonItem | null)[]
}

export const GeneralMenu = () => <abbr title="General">General</abbr>

export const General: FC<GeneralProps> = ({ mainColumnItems }) => {
  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const snackbars = <SnackbarStack snackbarList={[]}></SnackbarStack>

  const modals = [<></>]

  return (
    <div className="general" key="general">
      {modals}
      {snackbars}
      <Card className="column">
        <div className="title">
          {/* <Trans> */}
          General
          {/* </Trans> */}
        </div>
      </Card>
      {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )
}
