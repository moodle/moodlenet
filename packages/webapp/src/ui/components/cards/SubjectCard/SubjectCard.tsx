import { FC } from "react";
import '../../../styles/tags.css';
import { Organization } from "../../../types";
import Card from "../../atoms/Card/Card";
import "./styles.scss";

export type SubjectCardProps = {
  title: string
  organization: Pick<Organization, "url"|"color">
}

export const SubjectCard: FC <SubjectCardProps> = ({title, organization}) => {
  
  return (
    <Card style={{
      width: 'auto'
    }}>
      <div className="subject-card">
        <div className="title">
            {title}
        </div>
        <div className="subtitle">
          <div className="url">{organization.url}</div>
          <div className="color" style={{backgroundColor: organization.color}}></div>
        </div>
      </div>
    </Card>
  );
}

export default SubjectCard;