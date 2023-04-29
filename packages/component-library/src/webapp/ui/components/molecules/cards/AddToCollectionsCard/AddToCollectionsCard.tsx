import { FC, ReactNode } from 'react'
import { Selector, SelectorProps, useSelectorOption } from '../../../../lib/selector.js'
import Card from '../../../atoms/Card/Card.js'

import './AddToCollectionsCard.scss'

export type AddToCollectionsCardProps = SelectorProps & {
  header?: boolean
  noCard?: boolean
}
export type OptionItemProp = { value: string; label: ReactNode }
export const OptionItem: FC<OptionItemProp> = ({ label, value }) => {
  const { selected, toggle } = useSelectorOption(value) ?? {}

  return (
    <div className={`collection-name tag ${selected ? 'selected' : ''}`} onClick={toggle}>
      {label}
    </div>
  )
}

export const AddToCollectionsCard: FC<AddToCollectionsCardProps> = props => {
  const { header, noCard, children, ...selectorProps } = props

  return (
    <Selector {...selectorProps}>
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
