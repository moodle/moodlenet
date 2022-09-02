import { FC, PropsWithChildren, useContext } from 'react'
import { Link } from 'react-router-dom'
import { PrimaryButton, SecondaryButton } from '../../../atoms'
import { AddonCtx } from '../addons'
import HeaderTitle from '../HeaderTitle/HeaderTitle'
import './MinimalisticHeader.scss'

type MinimalisticHeaderProps = {
  page: 'login' | 'signup' | 'activation' | 'rootLogin'
}

const MinimalisticHeader: FC<PropsWithChildren<MinimalisticHeaderProps>> = ({ page } /* { devMode, setDevMode } */) => {
  const addonCtx = useContext(AddonCtx)
  return (
    <div className="minimalistic-header">
      <div className="content">
        <div className="left">
          <HeaderTitle
          // logo={logo} smallLogo={smallLogo}
          />
        </div>
        <div className="right">
          {addonCtx.rightComponents.flatMap(({ addon: { MinHeaderItems } }, index) => {
            return (MinHeaderItems ?? []).map((Item, subIndex) => <Item key={`${index}:${subIndex}`} />)
          })}
          {page !== 'activation' ? (
            <div className="buttons">
              {page !== 'signup' && (
                <Link to="/signup">
                  {' '}
                  {/* TODO Implement on Controller */}
                  <SecondaryButton color="orange">
                    {/* <Trans> */}
                    Sign up
                    {/* </Trans> */}
                  </SecondaryButton>
                </Link>
              )}
              {page !== 'login' && (
                <Link to="/login">
                  {' '}
                  {/* TODO Implement on Controller */}
                  <SecondaryButton color="orange">
                    {/* <Trans> */}
                    Log in
                    {/* </Trans> */}
                  </SecondaryButton>
                </Link>
              )}
              <a href="https://moodle.com/moodlenet/" target="__blank">
                <PrimaryButton color="grey">
                  {/* <Trans> */}
                  Learn more
                  {/* </Trans> */}
                </PrimaryButton>
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}

export default MinimalisticHeader
