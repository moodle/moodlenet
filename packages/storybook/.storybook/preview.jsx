import { MemoryRouter } from 'react-router-dom'
import SnackbarCtxProvider from '../../component-library/src/webapp/ui/components/atoms/Snackbar/SnackbarContext'
import { ProvideViewport } from '../../react-app/src/webapp/ui/lib/viewport'
import { ProvideStorybookLinkComponent } from '../src/lib/SBLinkComponent'
import { ProvideSBMainSearchBoxCtx } from '../src/MainSearchBoxCtxProvider'
import { Wrapper } from '../src/Wrapper'

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
  Story => (
    <ProvideViewport>
      <MemoryRouter>
        <ProvideStorybookLinkComponent>
          <Wrapper>
            <ProvideSBMainSearchBoxCtx>
              <SnackbarCtxProvider>
                <Story />
              </SnackbarCtxProvider>
            </ProvideSBMainSearchBoxCtx>
          </Wrapper>
        </ProvideStorybookLinkComponent>
      </MemoryRouter>
    </ProvideViewport>
  ),
]
