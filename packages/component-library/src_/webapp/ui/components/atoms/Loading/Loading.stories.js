import { jsx as _jsx } from "react/jsx-runtime";
import { Loading } from './Loading.js';
const meta = {
    title: 'Atoms/Loading',
    component: Loading,
    argTypes: {
    // backgroundColor: { control: 'color' },
    },
    excludeStories: ['LoadingStoryProps'],
    decorators: [
        (Story) => (_jsx("div", { style: {
                height: 100,
                width: 300,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }, children: _jsx(Story, {}) })),
    ],
};
export const LoadingStoryProps = { color: 'orange', size: 40 };
const LoadingStory = (args) => (_jsx(Loading, { ...args }));
export const LoadingDefault = LoadingStory.bind({});
LoadingDefault.args = LoadingStoryProps;
export default meta;
//# sourceMappingURL=Loading.stories.js.map