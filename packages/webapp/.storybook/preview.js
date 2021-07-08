import { LocalizationProvider } from '../src/context/Global/Localization';
import { ProvideGlobalSBLinkComponent } from '../src/ui/lib/SBLinkComponent';
// import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered'
}
export const decorators = [
  (Story) => (
    <LocalizationProvider>
      <ProvideGlobalSBLinkComponent>
        <Story />
      </ProvideGlobalSBLinkComponent>
    </LocalizationProvider>
  ),
];
