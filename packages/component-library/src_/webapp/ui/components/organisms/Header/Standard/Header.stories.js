import { jsx as _jsx } from "react/jsx-runtime";
// import { href } from '../../../../elements/link'
import { HeaderTitleOrganizationStoryProps, HeaderTitleStoryProps } from '../HeaderTitle/HeaderTitle.stories.js';
import Header from './Header.js';
const meta = {
    title: 'Organisms/Header',
    component: Header,
    argTypes: {
    // backgroundColor: { control: 'color' },
    },
    excludeStories: ['HeaderStoryProps', 'HeaderOrganizationStoryProps'],
};
export const HeaderStoryProps = {
    //   homeHref: href('Landing/Logged In'),
    organization: { ...HeaderTitleStoryProps }
};
export const HeaderOrganizationStoryProps = {
    //   homeHref: href('Landing/Logged In'),
    organization: { ...HeaderTitleOrganizationStoryProps }
};
const HeaderStory = args => _jsx(Header, { ...args });
export const HeaderDefault = HeaderStory.bind({});
HeaderDefault.args = HeaderStoryProps;
export const HeaderOrganization = HeaderStory.bind({});
HeaderOrganization.args = HeaderOrganizationStoryProps;
export default meta;
//# sourceMappingURL=Header.stories.js.map