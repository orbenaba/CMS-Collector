import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";
import Fade from "react-reveal";
import { useHistory } from "react-router-dom";

import * as S from "./styles";

import Button from "../../../Shared/Button";

import Title from "../../Title"

const MiddleBlock = ({ title, content, button}) => {
  const history = useHistory();
  const handleClick = () => {
    history.push("/register");
  }

  return (
    <S.MiddleBlock>
      <Row type="flex" justify="center" align="middle">
        <Fade bottom>
          <S.ContentWrapper>
            <Col lg={24} md={24} sm={24} xs={24}>
              <Title title={title} style={{fontSize: "1.7rem"}}/>
              <S.Content>{content}</S.Content>
              {button ? (
                <Button
                  name="submit"
                  type="submit"
                  onClick={handleClick}
                >
                  {button}
                </Button>
              ) : (
                ""
              )}
            </Col>
          </S.ContentWrapper>
        </Fade>
      </Row>
    </S.MiddleBlock>
  );
};

export default withTranslation()(MiddleBlock);
