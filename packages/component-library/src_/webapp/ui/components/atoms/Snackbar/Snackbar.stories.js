import { jsx as _jsx } from "react/jsx-runtime";
import { action } from '@storybook/addon-actions';
import { Snackbar } from './Snackbar.js';
const meta = {
    title: 'Atoms/Snackbar',
    component: Snackbar,
};
const SnackbarStory = (args) => (_jsx(Snackbar, { ...args }));
export const SnackbarDefault = SnackbarStory.bind({});
SnackbarDefault.args = {
    onClose: action('close Snackbar'),
    children: _jsx("div", { children: "Snackbar Content" }),
};
export const Success = SnackbarStory.bind({});
Success.args = {
    type: 'success',
    onClose: action('close Snackbar'),
    children: _jsx("div", { children: "Snackbar Content" }),
};
export const Warning = SnackbarStory.bind({});
Warning.args = {
    type: 'warning',
    onClose: action('close Snackbar'),
    children: _jsx("div", { children: "Snackbar Content" }),
};
export const SnackbarError = SnackbarStory.bind({});
SnackbarError.args = {
    type: 'error',
    onClose: action('close Snackbar'),
    children: _jsx("div", { children: "Snackbar Content" }),
};
export const Info = SnackbarStory.bind({});
Info.args = {
    type: 'info',
    onClose: action('close Snackbar'),
    children: _jsx("div", { children: "Snackbar Content" }),
};
export default meta;
//# sourceMappingURL=Snackbar.stories.js.map