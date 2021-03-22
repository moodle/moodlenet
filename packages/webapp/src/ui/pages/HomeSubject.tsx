import { FC } from 'react'
import { BaseContentNodePanel, UseBaseContentNodePanelProps } from '../components/BaseContentNodePanel'
import { UsePageHeaderProps } from '../components/PageHeader'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'

export type BaseContentPropsNodePage = {
  usePageHeaderProps: UsePageHeaderProps
  useBaseContentNodePanelProps: UseBaseContentNodePanelProps
}
export const BaseContentNodePage: FC<BaseContentPropsNodePage> = ({
  usePageHeaderProps,
  useBaseContentNodePanelProps,
}) => {
  return (
    <HeaderPageTemplate useProps={usePageHeaderProps}>
      <BaseContentNodePanel useProps={useBaseContentNodePanelProps} />
    </HeaderPageTemplate>
  )
}
