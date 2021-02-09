import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { FC } from 'react'

export const i18n = setupI18n({
  locales: [],
})

export const LocalizationProvider: FC = ({ children }) => {
  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
      {children}
    </I18nProvider>
  )
}
