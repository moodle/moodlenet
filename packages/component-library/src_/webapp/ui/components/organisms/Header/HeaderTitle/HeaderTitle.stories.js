import { jsx as _jsx } from "react/jsx-runtime";
// import { href } from '../../../../elements/link'
import smallLogo from '../../../../assets/logos/moodlenet-logo-small.svg';
import logo from '../../../../assets/logos/moodlenet-logo.svg';
import { HeaderTitle } from './HeaderTitle.js';
const meta = {
    title: 'Atoms/HeaderTitle',
    component: HeaderTitle,
    argTypes: {
    // backgroundColor: { control: 'color' },
    },
    excludeStories: ['HeaderTitleStoryProps', 'HeaderTitleOrganizationStoryProps'],
};
export const HeaderTitleStoryProps = {
    //   homeHref: href('Landing/Logged In'),
    url: '/',
    logo: logo,
    smallLogo: smallLogo,
};
export const HeaderTitleOrganizationStoryProps = {
    //   homeHref: href('Landing/Logged In'),
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
    smallLogo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
};
const HeaderTitleStory = args => _jsx(HeaderTitle, { ...args });
export const HeaderTitleDefault = HeaderTitleStory.bind({});
HeaderTitleDefault.args = HeaderTitleStoryProps;
export const HeaderTitleOrganization = HeaderTitleStory.bind({});
HeaderTitleOrganization.args = HeaderTitleOrganizationStoryProps;
export default meta;
//# sourceMappingURL=HeaderTitle.stories.js.map