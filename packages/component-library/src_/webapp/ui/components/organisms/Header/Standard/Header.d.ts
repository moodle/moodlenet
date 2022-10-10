import { FC, PropsWithChildren } from 'react';
import { Organization } from '../../../../types.js';
import './Header.scss';
export declare type HeaderProps = {
    user?: {
        avatarUrl?: string;
        logout: () => void;
    };
    organization: Organization;
};
declare const Header: FC<PropsWithChildren<HeaderProps>>;
export default Header;
//# sourceMappingURL=Header.d.ts.map