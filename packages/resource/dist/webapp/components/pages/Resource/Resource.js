import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { InsertDriveFile, Link } from '@material-ui/icons';
import { Card, Modal, PrimaryButton, SecondaryButton, } from '@moodlenet/component-library';
import { MainLayout, } from '@moodlenet/react-app/ui';
import { useState } from 'react';
import { ContributorCard, } from '../../molecules/ContributorCard/ContributorCard.js';
import { ContributorCardStoryProps } from '../../molecules/ContributorCard/ContributorCard.stories.js';
import { MainResourceCard, } from '../../organisms/MainResourceCard/MainResourceCard.js';
import './Resource.scss';
export const Resource = ({ mainLayoutProps, mainResourceCardProps, mainColumnItems, sideColumnItems, 
// moreButtonItems,
// resource,
// editResource,
deleteResource, 
// id: resourceId,
// url: resourceUrl,
contentType,
// type,
// resourceFormat,
// contentUrl,
// tags,
// isAuthenticated,
// canEdit,
// isAdmin,
// isOwner,
// autoImageAdded,
 }) => {
    // const form = useFormik<ResourceFormValues>({
    //   initialValues: resource,
    //   // validate:yup,
    //   onSubmit: values => {
    //     return editResource(values)
    //   },
    // })
    const [isEditing, setIsEditing] = useState(
    // canSearchImage && autoImageAdded
    false);
    //   const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
    //     useState<boolean>(false)
    //   const [isAddingToCollection, setIsAddingToCollection] =
    //     useState<boolean>(false)
    //   const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
    //     useState<boolean>(false)
    const [isToDelete, setIsToDelete] = useState(false);
    // const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
    // const backupImage: AssetInfo | null | undefined = useMemo(
    //   () => getBackupImage(resourceId),
    //   [resourceId],
    // )
    //   const [isReporting, setIsReporting] = useState<boolean>(false)
    //   const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
    // const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
    // const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)
    // const [imageUrl] = useImageUrl(form.values?.image?.location, backupImage?.location)
    const mainResourceCard = {
        Item: () => (_jsx(MainResourceCard, { ...mainResourceCardProps, isEditing: isEditing, setIsEditing: setIsEditing })),
        key: 'main-resource-card',
    };
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
    const updatedMainColumnItems = [mainResourceCard, ...(mainColumnItems ?? [])].filter((item) => !!item);
    const snackbars = _jsx(_Fragment, {});
    const modals = (_jsx(_Fragment, { children: isToDelete && deleteResource && (_jsx(Modal, { title: `Alert`, actions: _jsx(PrimaryButton, { onClick: () => {
                    deleteResource();
                    setIsToDelete(false);
                }, color: "red", children: "Delete" }), onClose: () => setIsToDelete(false), style: { maxWidth: '400px' }, className: "delete-message", children: "The resource will be deleted" })) }));
    return (_jsxs(MainLayout, { ...mainLayoutProps, children: [modals, snackbars, _jsx("div", { className: "resource", children: _jsxs("div", { className: "content", children: [_jsx("div", { className: "main-column", children: updatedMainColumnItems.map(i => (_jsx(i.Item, {}, i.key))) }), _jsx("div", { className: "side-column", children: updatedSideColumnItems?.map(i => (_jsx(i.Item, {}, i.key))) })] }) })] }));
};
Resource.displayName = 'ResourcePage';
export default Resource;
//# sourceMappingURL=Resource.js.map