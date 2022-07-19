import CallMadeIcon from '@material-ui/icons/CallMade'
import { CSSProperties, FC, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthCtx } from '../../../../../../react-app-lib/auth'
import Card from '../../../atoms/Card/Card'
import { MainLayout } from '../../../layout'
import './Signup.scss'

export type SignupFormValues = { name: string; email: string; password: string }
export type SignupProps = {}

export const Signup: FC<SignupProps> = () => {
  return (
    <MainLayout headerType="minimalistic" style={{ height: '100%' }}>
      <SignupBody />
    </MainLayout>
  )
}
export const SignupBody: FC<SignupProps> = ({}) => {
  // const shouldShowErrors =
  //   !!form.submitCount && (!!signupErrorMessage || !form.isValid)

  const authCtx = useContext(AuthCtx)
  const defaultSignupItem = authCtx.signupItems[0]
  const [currSignupItem, chooseSignupItem] = useState(defaultSignupItem)
  useEffect(() => chooseSignupItem(defaultSignupItem), [defaultSignupItem])

  return (
    <div className={`signup-page`}>
      {/* <div className={`signup-page ${requestSent ? 'success' : ''}`} onKeyDown={handleKeyDown}> */}
      <div className={`signup-content`}>
        {/* <div className={`signup-content ${requestSent ? 'success' : ''}`}> */}
        <Card hover={true}>
          <Link to={`/login`}>
            Log in
            <CallMadeIcon />
          </Link>
        </Card>
        <Card className="signup-card">
          <div className="content">
            <div className="title">Sign up</div>
            {currSignupItem ? <currSignupItem.def.Panel /> : <div>No Auth available</div>}
            {authCtx.signupItems.length > 1 && (
              <>
                <div>
                  {/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}
                  {authCtx.signupItems.map((signupItem, index) => {
                    const isCurrent = signupItem === currSignupItem
                    const css: CSSProperties = {
                      float: 'left',
                      cursor: isCurrent ? undefined : 'pointer',
                      fontWeight: isCurrent ? 'bold' : undefined,
                      display: isCurrent ? 'none' : 'block',
                    }
                    const onClick = isCurrent ? undefined : () => chooseSignupItem(signupItem)

                    return (
                      <div key={index} style={css} onClick={onClick}>
                        <signupItem.def.Icon />
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* <div className="bottom">
              <div className="left"> */}
            {/* <Link href={userAgreementHref} target="__blank"> */}
            {/* <a>
                  <TertiaryButton>You agree to our Terms &amp; Conditions</TertiaryButton>
                </a> */}
            {/* </Link> */}
          </div>
          {/* <div className="right" hidden>
                <div className="icon">
                  <img
                    alt="apple Signup"
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                  />
                </div>
                <div className="icon">
                  <img
                    alt="google Signup"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  />
                </div>
              </div> */}
          {/* </div> */}
          {/* </div> */}
        </Card>
      </div>
    </div>
  )
}
