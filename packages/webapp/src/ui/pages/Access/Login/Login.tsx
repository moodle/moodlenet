import CallMadeIcon from '@material-ui/icons/CallMade';
import { FC } from 'react';
import Card from '../../../components/atoms/Card/Card';
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton';
import TertiaryButton from '../../../components/atoms/TertiaryButton/TertiaryButton';
import { MainPageWrapper } from '../../../templates/page/MainPageWrapper';
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader';
import './styles.scss';

export type LoginProps = {
  accessHeaderProps: AccessHeaderProps
}

export const Login: FC<LoginProps> = ({accessHeaderProps}) => {
  return (
    <MainPageWrapper>
      <div className="login-page">
        <AccessHeader {...accessHeaderProps}/>
        <div className="separator" />
        <div className="content">
          <Card>
            <div className="content">
              <div className="title">Login</div>
              <form>
                <input className="email" type="text" id="fname" placeholder="Email" name="fname"/>
                <input className="password" type="password" id="fname" placeholder="Password" name="fname"/>
              </form>
              <div className="bottom">
                <PrimaryButton>Next</PrimaryButton>
                <TertiaryButton>or browse now!</TertiaryButton>
              </div>
            </div>
            

          </Card>
          <Card>
            Sign up
            <CallMadeIcon/>
          </Card>
        </div>
      </div>
    </MainPageWrapper>
  );
}