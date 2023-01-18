import { jsx as _jsx } from "react/jsx-runtime";
import { href } from '@moodlenet/react-app/ui';
import { AuthCtx } from '@moodlenet/react-app/web-lib';
import { useContext } from 'react';
export const text = 'Resource';
export const path = href('/@moodlenet/web-user/resource');
export const className = 'resource';
export const key = 'resource';
export const position = 0;
export const IconContainer = () => {
    const { clientSessionData } = useContext(AuthCtx);
    if (!clientSessionData?.myUserNode) {
        return null;
    }
    const iconUrl = ''; // TODO: should use avatarUrl from clientSessionData?.myUserNode
    return _jsx(Icon, { icon: iconUrl });
};
export const Icon = ({ icon }) => {
    return typeof icon === 'string' ? (_jsx("div", { style: {
            backgroundImage: 'url("' + icon + '")',
            // backgroundImage: 'url(' + clientSessionData.userDisplay.avatarUrl + ')',
            backgroundSize: 'cover',
        }, className: "avatar" })) : (icon);
};
//# sourceMappingURL=Header.js.map