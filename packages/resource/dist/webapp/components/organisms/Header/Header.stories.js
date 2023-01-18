import { jsx as _jsx } from "react/jsx-runtime";
import { href } from '@moodlenet/react-app/ui';
import { className, Icon, key, position, text } from './Header.js';
export const HeaderProfileStoryProps = (icon) => {
    return {
        text: text,
        Icon: _jsx(Icon, { icon: icon }),
        className: className,
        position: position,
        path: href('Pages/Resource/Logged In'),
        key: key,
    };
};
export default HeaderProfileStoryProps;
//# sourceMappingURL=Header.stories.js.map