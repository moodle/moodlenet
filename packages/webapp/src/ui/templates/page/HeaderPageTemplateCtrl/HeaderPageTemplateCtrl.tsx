import { useSession } from '../../../../context/Global/Session'
import { createWithProps } from '../../../lib/ctrl'
import { headerPageCtrlwithProps } from '../../../pages/HeaderPage/HeaderPageCtrl/HeaderPageCtrl'
import { HeaderPageTemplateProps } from '../HeaderPageTemplate'

export const [HeaderPageTemplateCtrl, HeaderPageTemplateCtrlWithProps] = createWithProps<HeaderPageTemplateProps, {}>(
  ({ __key, __uiComp: HeaderPageTemplateUI, ...rest }) => {
    const { session } = useSession()
    const headerPageTemplateProps: HeaderPageTemplateProps = {
      ...rest,
      isAuthenticated: !!session,
      headerPageWithProps: headerPageCtrlwithProps({ key: 'HeaderPage' }),
    }
    return <HeaderPageTemplateUI {...headerPageTemplateProps} />
  },
)
