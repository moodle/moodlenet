import { useSession } from '../../../../context/Global/Session'
import { createWithProps } from '../../../lib/ctrl'
import { headerPageWithProps } from '../../../pages/HeaderPage/Ctrl/HeaderPageCtrl'
import { HeaderPageTemplateProps } from '../HeaderPageTemplate'

export const [HeaderPageTemplateCtrl, headerPageTemplateWithProps] = createWithProps<HeaderPageTemplateProps, {}>(
  ({ __key, __uiComp: HeaderPageTemplateUI, ...rest }) => {
    const { session } = useSession()
    const headerPageTemplateProps: HeaderPageTemplateProps = {
      ...rest,
      isAuthenticated: !!session,
      headerPageWithProps: headerPageWithProps({ key: 'HeaderPage' }),
    }
    return <HeaderPageTemplateUI {...headerPageTemplateProps} />
  },
)
