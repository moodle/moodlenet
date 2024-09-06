import { MemoryRouter } from 'react-router-dom'
import SnackbarCtxProvider from '../../component-library/src/webapp/ui/components/atoms/Snackbar/SnackbarContext'
import { ProvideViewport } from '../../react-app/src/webapp/ui/lib/viewport'
import { Wrapper } from '../src/Wrapper'
import { ProvideStorybookLinkComponent } from '../src/lib/SBLinkComponent'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      order: [
        'Atoms',
        'Molecules',
        'Organisms',
        'Templates',
        'Pages',
        ['Access', 'Landing', 'Profile', 'Settings'],
        'Emails',
      ],
    },
    sidebar: {
      collapsedRoots: ['atoms', 'molecules', 'organisms', 'templates', 'pages', 'emails'],
    },
    showPanel: false,
  },
  controls: {
    expanded: false,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'fullscreen',
}

export const decorators = [
  (Story, context) => {
    const isNoWrapper = context.parameters?.layout === 'no-wrapper'

    return (
      <ProvideViewport>
        <MemoryRouter>
          <ProvideStorybookLinkComponent>
            {isNoWrapper ? (
              <SnackbarCtxProvider>
                <Story />
              </SnackbarCtxProvider>
            ) : (
              <Wrapper>
                <SnackbarCtxProvider>
                  <Story />
                </SnackbarCtxProvider>
              </Wrapper>
            )}
          </ProvideStorybookLinkComponent>
        </MemoryRouter>
      </ProvideViewport>
    )
  },
]
