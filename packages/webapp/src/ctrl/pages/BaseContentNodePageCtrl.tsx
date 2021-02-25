import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { FC } from 'react'
import { BaseContentNodePage } from '../../ui/pages/BaseContentNodePage'
import { useBaseContentNodeQuery } from './BaseContentNodePageCtrl/baseContentNode.gen'

export type BaseContentNodePanelCtrlProps = {
  id: Id
}
export const BaseContentNodePanelCtrl: FC<BaseContentNodePanelCtrlProps> = ({ id }) => {
  const { data } = useBaseContentNodeQuery({ variables: { id } })
  return data?.node ? <BaseContentNodePage item={data.node} /> : null
}
