import { CSSProperties, FC, ReactNode } from 'react';
import { Organization } from '../../../types.js';
import './MainLayout.scss';
export declare type MainLayoutProps = {
    organization: Organization;
    style?: CSSProperties;
    contentStyle?: CSSProperties;
    children?: ReactNode;
};
export declare const MainLayout: FC<MainLayoutProps>;
export default MainLayout;
//# sourceMappingURL=MainLayout.d.ts.map