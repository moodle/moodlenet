import * as ui from '../webapp/ui'
import defaultAvatar from '../webapp/ui/assets/img/default-avatar.svg'
import * as header from '../webapp/ui/components/organisms/Header/addons'
import { ContentGraphContext } from '../webapp/ui/components/pages/ContentGraph/ContentGraphProvider'
import * as settings from '../webapp/ui/components/pages/Settings/SettingsContext'
import * as auth from './auth'
import priHttp from './pri-http'
declare global {
  export type MoodlenetLib = typeof lib
}

const lib = {
  priHttp,
  ui,
  auth,
  settings,
  header,
  contentGraph: { Context: ContentGraphContext },
  defaultAvatar,
}

export default lib
