import CallMadeIcon from '@material-ui/icons/CallMade'
import { CSSProperties, FC, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthCtx } from '../../../../../../react-app-lib/auth'
// import { Link } from '../../../../elements/link'
import Card from '../../../atoms/Card/Card'
import SimpleLayout from '../../../layout/SimpleLayout/SimpleLayout'
import './Login.scss'

export type LoginProps = {}

export const Login: FC<LoginProps> = () => {
  return (
    <SimpleLayout page="login" style={{ height: '100%' }} contentStyle={{ padding: '0' }}>
      <LoginBody />
    </SimpleLayout>
  )
}
export const LoginBody: FC<LoginProps> = ({}) => {
  const authCtx = useContext(AuthCtx)
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (e.key === 'Enter') {
  //     // form.submitForm()
  //   }
  // }

  // const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)

  const defaultLoginItem = authCtx.loginItems[0]
  const [currLoginItem, chooseLoginItem] = useState(defaultLoginItem)
  useEffect(() => chooseLoginItem(defaultLoginItem), [defaultLoginItem])
  return (
    <div className="login-page">
      <div className="content">
        <Card className="login-card">
          <div className="content">
            <div className="title">Log in</div>
            {currLoginItem ? <currLoginItem.def.Panel /> : <div>No Auth available</div>}
            {authCtx.loginItems.length > 1 && (
              <>
                {/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}
                {authCtx.loginItems.map((loginItem, index) => {
                  const isCurrent = loginItem === currLoginItem
                  const css: CSSProperties = {
                    float: 'left',
                    cursor: isCurrent ? undefined : 'pointer',
                    fontWeight: isCurrent ? 'bold' : undefined,
                    display: isCurrent ? 'none' : 'block',
                  }
                  const onClick = isCurrent ? undefined : () => chooseLoginItem(loginItem)

                  return (
                    <div key={index} style={css} onClick={onClick}>
                      <loginItem.def.Icon />
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </Card>
        <Card hover={true}>
          <Link to={`/signup`}>
            Sign up
            <CallMadeIcon />
          </Link>
        </Card>
      </div>
    </div>
  )
}

Login.displayName = 'LoginPage'
