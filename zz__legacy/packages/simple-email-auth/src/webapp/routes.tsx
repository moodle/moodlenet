import { Route } from 'react-router-dom'
import { RECOVER_PASSWORD_PATH, SET_NEW_PASSWORD_PATH } from '../common/webapp-routes.mjs'
import { NewPasswordContainer } from '../../../../../app-nextjs-moodlenet/src/app/(simple-layout)/login/@emailPwd/NewPassword/NewPasswordContainer.js'
import { RecoverPasswordContainer } from '../../../../../app-nextjs-moodlenet/src/app/(simple-layout)/login/@emailPwd/RecoverPassword/RecoverPasswordContainer.js'
export const routes = (
  <>
    <Route path={RECOVER_PASSWORD_PATH} element={<RecoverPasswordContainer />} />
    <Route path={SET_NEW_PASSWORD_PATH} element={<NewPasswordContainer />} />
  </>
)
