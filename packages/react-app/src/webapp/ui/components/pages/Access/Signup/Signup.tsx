import CallMadeIcon from '@material-ui/icons/CallMade'
import { CSSProperties, FC, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { MainContext } from '../../../../../MainContext'
import Card from '../../../atoms/Card/Card'
import { SimpleLayout } from '../../../layout'
import './Signup.scss'

export type SignupFormValues = { name: string; email: string; password: string }
export type SignupProps = {}

export const Signup: FC<SignupProps> = () => {
  return (
    <SimpleLayout page="signup">
      <SignupBody />
    </SimpleLayout>
  )
}
export const SignupBody: FC<SignupProps> = ({}) => {
  // const shouldShowErrors =
  //   !!form.submitCount && (!!signupErrorMessage || !form.isValid)
  const {
    registries: {
      auth: { signup },
    },
  } = useContext(MainContext)
  const { registry: signupRegs } = signup.useRegistry()

  const defaultSignupEntry = signupRegs.entries[0]
  const [currSignupEntry, chooseSignupEntry] = useState(defaultSignupEntry)
  //useEffect(() => chooseSignupItem(defaultSignupEntry), [defaultSignupEntry])

  return (
    <div className={`signup-page`}>
      {/* <div className={`signup-page ${requestSent ? 'success' : ''}`} onKeyDown={handleKeyDown}> */}
      <div className={`signup-content`}>
        {/* <div className={`signup-content ${requestSent ? 'success' : ''}`}> */}
        <Card className="login-card" hover={true}>
          <Link to={`/login`}>
            Log in
            <CallMadeIcon />
          </Link>
        </Card>
        <Card className="signup-card">
          <div className="content">
            <div className="title">Sign up</div>
            {currSignupEntry ? <currSignupEntry.item.Panel /> : <div>No Auth available</div>}
            {signupRegs.entries.length > 1 && (
              <>
                <div>
                  {/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}
                  {signupRegs.entries.map((signupEntry, index) => {
                    const isCurrent = signupEntry === currSignupEntry
                    const css: CSSProperties = {
                      float: 'left',
                      cursor: isCurrent ? undefined : 'pointer',
                      fontWeight: isCurrent ? 'bold' : undefined,
                      display: isCurrent ? 'none' : 'block',
                    }
                    const onClick = isCurrent ? undefined : () => chooseSignupEntry(signupEntry)

                    return (
                      <div key={index} style={css} onClick={onClick}>
                        <signupEntry.item.Icon />
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
