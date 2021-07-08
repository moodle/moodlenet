import { FC } from 'react';
import HeaderTitle from '../../../components/Header/HeaderTitle/HeaderTitle';
import { Organization } from '../../../types';
import './styles.scss';

export type AccessHeaderProps = {
    organization: Pick<Organization, "logo"|"name"|"url">
}

export const AccessHeader: FC<AccessHeaderProps> = ({organization}) => {
  return (
    <div className="access-header">
      <div className="content">
        <div className="left">
          <HeaderTitle organization={organization}/>
        </div>
        <div className="right">
        </div>
        </div>
    </div>
  )
}

export default AccessHeader;
