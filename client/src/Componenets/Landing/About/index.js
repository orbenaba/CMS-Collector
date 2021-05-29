// React Modules
import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";

// Styling
import * as S from "./styles";

// Profile Image
import orProfile from "../content/img/or.jpg";
import shakedProfile from "../content/img/shaked.jpg";
import FrenProfile from "../content/img/Fren.jpg"

const About = ({ icon, title, content, section, t, id }) => {
  const parseNameToImportImage = (name) => {
    switch (name) {
      case "or":
        return orProfile;
      case "shaked":
        return shakedProfile;
      default:
        return FrenProfile;
    }
  };

  return (
    <S.LeftContentBlock>
      <Row jusitfy="center" id={id}>
        {section &&
          typeof section === "object" &&
          section.map((item, id) => {
            return (
              <Col key={id} span={8}>
                <a href={item.github} target="blank">
                  <img
                    src={parseNameToImportImage(item.name)}
                    width="120px"
                    height="150px"
                    style={{
                      borderRadius: "1rem",
                      display: "flex",
                      margin: "0 auto",
                      cursor: "pointer",
                    }}
                  />
                </a>
                <S.MinTitle>{item.title}</S.MinTitle>
                <S.MinPara>{t(item.content)}</S.MinPara>
              </Col>
            );
          })}
      </Row>
    </S.LeftContentBlock>
  );
};

export default withTranslation()(About);
