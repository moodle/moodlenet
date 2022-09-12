import * as ui from '../ui'
import defaultAvatar from '../ui/assets/img/default-avatar.svg'
import * as header from '../ui/components/organisms/Header/addons'
import { ContentGraphContext } from '../ui/components/pages/ContentGraph/ContentGraphProvider'
import * as settings from '../ui/components/pages/Settings/SettingsContext'
import * as auth from './auth'
import priHttp from './pri-http'

export type MainLib = typeof lib

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
