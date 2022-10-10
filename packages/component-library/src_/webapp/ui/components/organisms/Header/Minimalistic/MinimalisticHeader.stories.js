import { jsx as _jsx } from "react/jsx-runtime";
import { HeaderTitleOrganizationStoryProps, HeaderTitleStoryProps } from '../HeaderTitle/HeaderTitle.stories.js';
// import { href } from '../../../../elements/link'
import MinimalisticHeader from './MinimalisticHeader.js';
const meta = {
    title: 'Organisms/MinimalisticHeader',
    component: MinimalisticHeader,
    argTypes: {
    // backgroundColor: { control: 'color' },
    },
    excludeStories: ['MinimalisticHeaderStoryProps', 'MinimalisticHeaderOrganizationStoryProps'],
};
export const MinimalisticHeaderStoryProps = {
    //   homeHref: href('Landing/Logged In'),
    page: 'login',
    organization: { ...HeaderTitleStoryProps }
};
export const MinimalisticHeaderOrganizationStoryProps = {
    page: 'login',
    //   homeHref: href('Landing/Logged In'),
    organization: { ...HeaderTitleOrganizationStoryProps }
};
const MinimalisticHeaderStory = args => _jsx(MinimalisticHeader, { ...args });
export const MinimalisticHeaderDefault = MinimalisticHeaderStory.bind({});
MinimalisticHeaderDefault.args = MinimalisticHeaderStoryProps;
export const MinimalisticHeaderOrganization = MinimalisticHeaderStory.bind({});
MinimalisticHeaderOrganization.args = MinimalisticHeaderOrganizationStoryProps;
export default meta;
//# sourceMappingURL=MinimalisticHeader.stories.js.map