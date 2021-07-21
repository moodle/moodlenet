import { FC } from 'react'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import HeaderTitle from '../../../components/Header/HeaderTitle/HeaderTitle'
import { Href } from '../../../elements/link'
import { Organization } from '../../../types'
import './styles.scss'

export type AccessHeaderProps = {
  organization: Pick<Organization, 'logo' | 'name' | 'url'>,
  homeHref: Href
}

export const AccessHeader: FC<AccessHeaderProps> = ({ organization, homeHref }) => {
  return (
    <div className="access-header">
      <div className="content">
        <HeaderTitle organization={organization} homeHref = {homeHref} />
        <PrimaryButton>Learn more</PrimaryButton>
      </div>
    </div>
  )
}
AccessHeader.displayName = 'AccessHeader'
export default AccessHeader
