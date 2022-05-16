// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FallbackProps } from '../Fallback'

export type FallbackCtrlProps = {}
export const useFallbackCtrl: CtrlHook<
  FallbackProps,
  FallbackCtrlProps
> = () => {
  return [fallbackProps({ key: 'fallback-page' })]
}

export const fallbackProps = ({ key }: { key: string }): FallbackProps => {
  return {
    headerPageTemplateProps: ctrlHook(
      useHeaderPageTemplateCtrl,
      {},
      `${key}-header-page-template`
    ),
  }
}
