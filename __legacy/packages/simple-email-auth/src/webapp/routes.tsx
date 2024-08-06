import { Route } from 'react-router-dom'
import { RECOVER_PASSWORD_PATH, SET_NEW_PASSWORD_PATH } from '../common/webapp-routes.mjs'
import { NewPasswordContainer } from './ui/NewPassword/NewPasswordContainer.js'
import { RecoverPasswordContainer } from './ui/RecoverPassword/RecoverPasswordContainer.js'
export const routes = (
  <>
    <Route path={RECOVER_PASSWORD_PATH} element={<RecoverPasswordContainer />} />
    <Route path={SET_NEW_PASSWORD_PATH} element={<NewPasswordContainer />} />
  </>
)
