import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// import { FormikHandle } from '../../../../lib/formik'
import InputTextField from '../../../atoms/InputTextField/InputTextField.js';
import Modal from '../../../atoms/Modal/Modal.js';
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton.js';
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton.js';
import './ReportModal.scss';
export const ReportModal = ({ title, className, 
// reportForm,
setIsReporting, setShowReportedAlert, }) => {
    return (_jsxs(Modal, { className: 'report-modal ' + className, title: title, closeButton: false, actions: _jsxs(_Fragment, { children: [_jsx(SecondaryButton, { color: "grey", onClick: () => {
                        setIsReporting(false);
                    }, children: "Cancel" }), _jsx(PrimaryButton, { onClick: () => {
                        // reportForm.submitForm()
                        setIsReporting(false);
                        setShowReportedAlert(false);
                        setTimeout(() => {
                            setShowReportedAlert(true);
                        }, 100);
                    }, children: "Report" })] }), onClose: () => setIsReporting(false), style: { maxWidth: '400px' }, children: [_jsx(InputTextField, { textarea: true, name: "comment", edit: true, placeholder: /* t */ `This is spam / commercial / not educational / fraud / copyrighted / other reason.` }), _jsx("div", { className: "required", children: "Required field" })] }));
};
ReportModal.defaultProps = {};
export default ReportModal;
//# sourceMappingURL=ReportModal.js.map