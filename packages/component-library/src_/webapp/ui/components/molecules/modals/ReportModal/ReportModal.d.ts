import { FC, SetStateAction } from 'react';
import './ReportModal.scss';
export declare type ReportModalDirection = 'horizontal' | 'vertical';
export declare type ReportModalProps = {
    title: string;
    setIsReporting: (value: SetStateAction<boolean>) => void;
    setShowReportedAlert: (value: SetStateAction<boolean>) => void;
    className?: string;
};
export declare const ReportModal: FC<ReportModalProps>;
export default ReportModal;
//# sourceMappingURL=ReportModal.d.ts.map