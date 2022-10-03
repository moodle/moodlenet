import { FC, PropsWithChildren, useContext } from 'react'
import { Link } from 'react-router-dom'
import { MainContext } from '../../../../../MainContext.js'
import { PrimaryButton } from '../../../atoms/PrimaryButton/PrimaryButton.js'
import { SecondaryButton } from '../../../atoms/SecondaryButton/SecondaryButton.js'
import HeaderTitle from '../HeaderTitle/HeaderTitle.js'
import './MinimalisticHeader.scss'

type MinimalisticHeaderProps = {
  page: 'login' | 'signup' | 'activation' | 'rootLogin'
}

const MinimalisticHeader: FC<PropsWithChildren<MinimalisticHeaderProps>> = ({ page } /* { devMode, setDevMode } */) => {
  const {
    // registries: {
    //   header: { rightComponents },
    // },
  } = useContext(MainContext)
  // const { registry: rightComponentsRegistry } = rightComponents.useRegistry()
  return (
    <div className="minimalistic-header">
      <div className="content">
        <div className="left">
          <HeaderTitle
          // logo={logo} smallLogo={smallLogo}
          />
        </div>
        <div className="right">
          {/* {rightComponentsRegistry.entries.flatMap(({ pkg, item: { Component } }, index) => {
            return <Component key={`${pkg.id}:${index}`} />
          })} */}
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
