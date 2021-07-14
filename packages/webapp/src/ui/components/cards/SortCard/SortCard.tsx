import { Trans } from '@lingui/macro';
import { FC, ReactNode } from "react";
import "./styles.scss";

export type SortCardProps = {
    className: string,
    title: string,
    content: ReactNode[]
}

export const SortCard: FC <SortCardProps> = ({
    className,
    content,
    title,
}) => {

  return (
    <div className={"sort-card " + className}>
        <div className="title"><Trans>{title}</Trans></div>
        <div className="content">{content}</div>
    </div>
  );
}

export default SortCard;
