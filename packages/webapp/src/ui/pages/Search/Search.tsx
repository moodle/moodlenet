import { FC } from 'react'
import { FilterCard, FilterCardProps } from '../../components/cards/FilterCard/FilterCard'
import { ProfileCard, ProfileCardProps } from '../../components/cards/ProfileCard/ProfileCard'
import { HeaderPageTemplate } from '../../templates/page/HeaderPageTemplate'
import { HeaderPageProps } from '../HeaderPage/HeaderPage'
import './styles.scss'

export type SearchProps = {
  headerPageProps: HeaderPageProps
  filterCardProps: FilterCardProps
  profileCardProps: ProfileCardProps
}

export const Search: FC<SearchProps> = ({
  headerPageProps,
  profileCardProps,
  filterCardProps,
}) => {
  return (
    <HeaderPageTemplate headerPageProps={headerPageProps}>
      <div className="search">
        <div className="content">
          <div className="side-column">
              <FilterCard {...filterCardProps} />
          </div>
          <div className="main-column">
            <ProfileCard {...profileCardProps} />
          </div>
        </div>
      </div>
    </HeaderPageTemplate>
  )
}
