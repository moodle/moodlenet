import { FC } from 'react';
import Header, { HeaderProps } from '../../components/Header/Header';
import SubHeader, { SubHeaderProps } from '../../components/SubHeader/SubHeader';
import './styles.scss';

export type HeaderPageProps = {
  headerProps: HeaderProps
  subHeaderProps: SubHeaderProps
}

export const HeaderPage: FC<HeaderPageProps> = ({
  headerProps,
  subHeaderProps
}) => {
  return (
    <div className="page-header">
      <Header {...headerProps} />
      {headerProps.me && 
        <SubHeader {...subHeaderProps} />
      }
    </div>
  )
}

export default HeaderPage;
