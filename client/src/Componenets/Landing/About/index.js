// React Modules
import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";

// Custom Modules
import SvgIcon from "../../Shared/SvgIcon";

// Styling
import * as S from "./styles";


// Profile Image
import orProfile from "../content/img/or.jpg";
import shakedProfile from "../content/img/shaked.jpg";

const About = ({ icon, title, content, section, t, id }) => {
  
    const parseNameToImportImage = (name) => {
    switch(name) {
      case "or":
        return orProfile;
      case  "shaked":
        return shakedProfile;
      default:
    }
  }

  return (
    <S.LeftContentBlock>
      <Row jusitfy="center" id={id}>
        {section &&
            typeof section === "object" &&
            section.map((item, id) => {
                return (
                    <Col key={id} span={8}>
                        <img src={parseNameToImportImage(item.name)} width="120px" height="150px" style={{
                          borderRadius: "1rem",
                          display: "flex",
                          margin: "0 auto"                
                      }}/>
                        <S.MinTitle>{t(item.title)}</S.MinTitle>
                        <S.MinPara>{t(item.content)}</S.MinPara>
                    </Col>
                );
        })}
      </Row>
     </S.LeftContentBlock>
  );
};

export default withTranslation()(About);
