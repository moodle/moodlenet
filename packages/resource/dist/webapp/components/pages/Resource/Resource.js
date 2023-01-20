import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { InsertDriveFile, Link } from '@material-ui/icons';
import { Card, PrimaryButton, SecondaryButton, } from '@moodlenet/component-library';
import { MainLayout, } from '@moodlenet/react-app/ui';
import { ContributorCard, } from '../../molecules/ContributorCard/ContributorCard.js';
import { ContributorCardStoryProps } from '../../molecules/ContributorCard/ContributorCard.stories.js';
import './Resource.scss';
export const Resource = ({ mainLayoutProps, mainColumnItems, sideColumnItems, contentType, }) => {
    // const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)
    // const resourCard: AddonItem = {
    //   Item: () => (
    //     <ResourceCard
    //       {...resourceCardProps}
    //       isEditing={isEditing}
    //       toggleIsEditing={toggleIsEditing}
    //     />
    //   ),
    //   key: 'resource-card',
    // }
    const contributorCard = {
        Item: () => _jsx(ContributorCard, { ...ContributorCardStoryProps }),
        key: 'contributor-card',
    };
    const actions = {
        Item: () => (_jsxs(Card, { className: "resource-action-card", hideBorderWhenSmall: true, children: [_jsx(PrimaryButton
                // onClick={() => setIsAddingToMoodleLms(true)}
                , { children: "Send to Moodle" }), _jsx(SecondaryButton
                // onClick={() => setIsAddingToCollection(true)}
                , { children: "Add to Collection" }), _jsx("a", { 
                    // href={contentUrl}
                    target: "_blank", rel: "noreferrer", children: _jsx(SecondaryButton, { children: contentType === 'file' ? (_jsxs(_Fragment, { children: [_jsx(InsertDriveFile, {}), "Download file"] })) : (_jsxs(_Fragment, { children: [_jsx(Link, {}), "Open link"] })) }) })] })),
        key: 'actions',
    };
    const updatedSideColumnItems = [contributorCard, actions, ...(sideColumnItems ?? [])].filter((item) => !!item);
    const updatedMainColumnItems = [contributorCard, ...(mainColumnItems ?? [])].filter((item) => !!item);
    return (_jsx(MainLayout, { ...mainLayoutProps, children: _jsx("div", { className: "resource", children: _jsxs("div", { className: "content", children: [_jsx("div", { className: "main-column", children: updatedMainColumnItems.map(i => (_jsx(i.Item, {}, i.key))) }), _jsx("div", { className: "side-column", children: updatedSideColumnItems?.map(i => (_jsx(i.Item, {}, i.key))) })] }) }) }));
};
Resource.displayName = 'ResourcePage';
export default Resource;
//# sourceMappingURL=Resource.js.map