import type { FC, PropsWithChildren, ReactNode } from 'react'
import type { SelectorProps } from '../../../../lib/selector.js'
import { Selector, useSelectorOption } from '../../../../lib/selector.js'
import Card from '../../../atoms/Card/Card.js'

import './AddToCollectionsCard.scss'

export type AddToCollectionsCardProps = {
  header?: boolean
  noCard?: boolean
} & Pick<SelectorProps & { multiple: true }, 'value' | 'onItemSelect' | 'onItemDeselect'>
export type OptionItemProp = { value: string; label: ReactNode }
export const OptionItem: FC<OptionItemProp> = ({ label, value }) => {
  const { toggle, selected } = useSelectorOption(value) ?? {}

  return (
    <div
      className={`collection-name tag ${selected ? 'selected' : ''}`}
      onClick={e => {
        e.stopPropagation()
        toggle?.()
      }}
    >
      {label}
    </div>
  )
}

export const AddToCollectionsCard: FC<PropsWithChildren<AddToCollectionsCardProps>> = props => {
  const { header, noCard, children, ...selectProps } = props

  return (
    <Selector {...selectProps} multiple>
      <div className="add-to-collections-card">
        <div className="content">
          <Card noCard={noCard}>
            {header && (
              <div className="collections-header">
                Select collections
                {/*<Searchbox setSearchText={setSearchText} searchText="" placeholder={t`Find more collections`} />*/}
              </div>
            )}
            <div className="collections tags">{children}</div>
          </Card>
        </div>
      </div>
    </Selector>
  )
}

AddToCollectionsCard.defaultProps = {
  header: true,
}
