import { jsx as _jsx } from "react/jsx-runtime";
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import PrimaryButton from '../PrimaryButton/PrimaryButton.js';
import { InputTextField } from './InputTextField.js';
const meta = {
    title: 'Atoms/InputTextField',
    component: InputTextField,
    argTypes: {
    // backgroundColor: { control: 'color' },
    },
    excludeStories: [
        'InputTextFieldStoryProps',
        'InputTextFieldErrorStoryProps',
        'TextAreaFieldStoryProps',
    ],
};
export const TransStory = () => {
    const [error, setError] = useState('');
    return (_jsx("div", { onClick: () => (error ? setError('') : setError('errore')), children: _jsx(InputTextField, { error: error }) }));
};
export const InputTextFieldStoryProps = {
    label: 'Just a text field',
    edit: true,
    placeholder: 'Start typing to fill it',
    onChange: action('text area change'),
    // onChange: action('input change'),
};
export const InputTextFieldErrorStoryProps = {
    ...InputTextFieldStoryProps,
    error: 'Just a cute error',
};
export const InputButton = () => (_jsx(InputTextField, { ...InputTextFieldStoryProps, action: _jsx(PrimaryButton, { onClick: action('Primary button click'), children: "Add" }) }));
const InputTextFieldStory = (args) => (_jsx(InputTextField, { ...args }));
export const Input = InputTextFieldStory.bind({});
Input.args = InputTextFieldStoryProps;
export const Error = InputTextFieldStory.bind({});
Error.args = InputTextFieldErrorStoryProps;
export const TextAreaFieldStoryProps = {
    label: 'Just a text area',
    edit: true,
    highlight: true,
    textarea: true,
    value: 'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    textAreaAutoSize: true,
    placeholder: 'Start typing to fill it',
    onChange: action('text area change'),
};
export const TextArea = InputTextFieldStory.bind({});
TextArea.args = TextAreaFieldStoryProps;
export default meta;
//# sourceMappingURL=InputTextField.stories.js.map