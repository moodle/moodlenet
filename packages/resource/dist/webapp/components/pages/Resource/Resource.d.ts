import { AddonItem } from '@moodlenet/component-library';
import { MainLayoutProps } from '@moodlenet/react-app/ui';
import { FC } from 'react';
import { ResourceCardPropsControlled } from '../../organisms/ResourceCard/ResourceCard.js';
import './Resource.scss';
export type ResourceProps = {
    mainLayoutProps: MainLayoutProps;
    resourceCardProps: ResourceCardPropsControlled;
    mainColumnItems?: AddonItem[];
    sideColumnItems?: AddonItem[];
};
export declare const Resource: FC<ResourceProps>;
export default Resource;
//# sourceMappingURL=Resource.d.ts.map