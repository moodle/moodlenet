import { jsx as _jsx } from "react/jsx-runtime";
// import { Button } from './Button'
import PrimaryButton from './PrimaryButton.js';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Atoms/PrimaryButton',
    component: PrimaryButton,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
    // backgroundColor: { control: 'color' },
    },
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = args => (_jsx(PrimaryButton, { ...args, children: "Button" }));
export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
// primary: true,
// label: 'Button',
};
export const Secondary = Template.bind({});
Secondary.args = {
// label: 'Button',
};
export const Large = Template.bind({});
Large.args = {
// size: 'large',
// label: 'Button',
};
export const Small = Template.bind({});
Small.args = {
// size: 'small',
// label: 'Button',
};
//# sourceMappingURL=PrimaryButton.stories.js.map