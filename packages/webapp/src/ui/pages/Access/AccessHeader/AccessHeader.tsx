import { FC } from 'react'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import HeaderTitle from '../../../components/Header/HeaderTitle/HeaderTitle'
import { Organization } from '../../../types'
import './styles.scss'

export type AccessHeaderProps = {
  organization: Pick<Organization, 'logo' | 'name' | 'url'>
}

export const AccessHeader: FC<AccessHeaderProps> = ({ organization }) => {
  return (
    <div className="access-header">
      <div className="content">
        <HeaderTitle organization={organization} />
        <PrimaryButton>Learn more</PrimaryButton>
      </div>
    </div>
  )
}
AccessHeader.displayName = 'AccessHeader'
export default AccessHeader
