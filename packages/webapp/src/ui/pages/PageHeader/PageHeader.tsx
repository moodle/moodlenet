import { FC } from 'react';
import Header, { HeaderProps } from '../../components/Header/Header';
import SubHeader, { SubHeaderProps } from '../../components/SubHeader/SubHeader';
import './styles.scss';

export type PageHeaderProps = {
  headerProps: HeaderProps
  subHeaderProps: SubHeaderProps
}

export const PageHeader: FC<PageHeaderProps> = ({
  headerProps,
  subHeaderProps
}) => {
  return (
    <div>
      <Header {...headerProps} />
      {headerProps.me && 
        <SubHeader {...subHeaderProps} />
      }
    </div>
    
  )
}

export default PageHeader;
