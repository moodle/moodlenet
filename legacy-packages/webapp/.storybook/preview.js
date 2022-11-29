import { LocalizationProvider } from '../src/context/Global/Localization';
import { ProvideStorybookLinkComponent } from '../src/ui/lib/storybook/SBLinkComponent';
// import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered',
  options: {
    storySort: {
      order: ['Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages']
    }
  }
}
export const decorators = [
  (Story) => (
    <LocalizationProvider>
      <ProvideStorybookLinkComponent>
        <Story />
      </ProvideStorybookLinkComponent>
    </LocalizationProvider>
  ),
];
