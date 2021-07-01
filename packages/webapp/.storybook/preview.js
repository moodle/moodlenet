import { LocalizationProvider } from '../src/context/Global/Localization';
// import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
export const decorators = [
  (Story) => (
    <LocalizationProvider>
      <Story />
    </LocalizationProvider>
  ),
];
