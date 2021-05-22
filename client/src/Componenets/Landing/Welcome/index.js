import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";
import Slide from "react-reveal/Slide";
import { useHistory } from "react-router-dom";

import SvgIcon from "../../Shared/SvgIcon";
import Button from "../../Shared/Button";

import Title from "../Title";


import * as S from "./styles";

const Welcome = ({ isAuth, content, button, icon, id }) => {
  const history = useHistory();
  const handleSignUp = () => {
    history.push("/register")
  }

  const handleLogin = () => {
    history.push("/login");
  }

  const handleActivity = () => {
    history.push("/activity")
  }

  const handleScan = () => {
    history.push("/scan")
  }

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({
      behavior: "smooth",
    });
  };

  let buttons = (
    <div style={{display: "flex", width: "100rem"}}>
      <Button
        width="true"
        onClick={handleSignUp}
      >
        Sign Up
      </Button>
      <Button
        color="#fff"
        width="true"
        onClick={handleLogin}
      >
        Log In
      </Button>
    </div>
  );
  if(isAuth) {
    buttons = (
      <div style={{display: "flex", width: "100rem"}}>
      <Button
          width="true"
          onClick={handleActivity}
        >
          My Activity
        </Button>
        <Button
          color="#fff"
          width="true"
          onClick={handleScan}
        >
          Scan
        </Button>
      </div>
    );
  }


  return (
    <S.RightBlockContainer>
      <Row type="flex" justify="space-between" align="middle" id={id}>
        <Col lg={11} md={11} sm={11} xs={24}>
          <Slide left>
            <S.ContentWrapper>
              <Title name="Content Management System" title="Collector"/>
              <S.Content>{content}</S.Content>
              <S.ButtonWrapper>
                {buttons}
              </S.ButtonWrapper>
            </S.ContentWrapper>
          </Slide>
        </Col>
        <Col lg={11} md={11} sm={12} xs={24}>
          <Slide right>
            <SvgIcon
              src={icon}
              className="about-block-image"
              width="100%"
              height="100%"
            />
          </Slide>
        </Col>
      </Row>
    </S.RightBlockContainer>
  );
};

export default withTranslation()(Welcome);
