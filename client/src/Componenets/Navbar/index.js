// react modules
import { useState, Fragment } from "react";
import { Row, Col, Drawer } from "antd";
import { CSSTransition } from "react-transition-group";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

// styling
import * as S from "./styles";

// custom modules
import SvgIcon from "../Shared/SvgIcon";
import Button from "../Shared/Button";
import {Consumer} from "../../Context"

// Helper Functions
import {IsLoggedIn} from "../../Helpers/Generals.Helpers"


const Navbar = ({ props }) => {
  const history = useHistory();
  const [isNavVisible] = useState(false);
  const [isSmallScreen] = useState(false);
  const [visible, setVisibility] = useState(false);
  const [currentBar, setCurrentBar] = useState("");
  // Event Handlers
  const showDrawer = () => {
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };

  const handleOptionClick = (sPath) => {
    setCurrentBar(sPath)
    history.push(sPath);
  }

  const IsInHomePage = () => {
    console.log(history)
    return history.location.pathname === "/";
  }

  const MenuItem = ({ arrBarOptions }) => {
    const scrollTo = (id) => {
      const element = document.getElementById(id);
      element.scrollIntoView({
        behavior: "smooth",
      });
      setVisibility(false);
    };

    let scrollToAbout = <></>

    if(IsInHomePage()) {
      scrollToAbout = (
        <S.CustomNavLinkSmall onClick={() => scrollTo("about")}>
          <S.Span>About</S.Span>
        </S.CustomNavLinkSmall>
      )
    }

    return (
      <Fragment>
        {scrollToAbout}
        {
            arrBarOptions.map(objBarOption => {
              return (
                <S.CustomNavLinkSmall onClick={()=> handleOptionClick(objBarOption.path)}>
                  <S.Span>{objBarOption.label}</S.Span> 
                </S.CustomNavLinkSmall>
              )
            })
          }
        

        <S.CustomNavLinkSmall
          style={{ width: "180px" }}
        >
          <S.Span>
            <Button>Contact</Button>
          </S.Span>

        </S.CustomNavLinkSmall>
      </Fragment>
    );
  };

  return (
    <Consumer>
      {value => {
        const { user } = value.state;
        let arrBarOptions = [
          {
            label: "Login",
            path: "/login"
          },
          {
            label: "Sign Up",
            path: "/register"
          }
        ]
        if(IsLoggedIn(user)) {
          arrBarOptions = [
            {
              label: "Scan",
              path: "/scanning"
            }
          ]
        }

        return (
          <S.Header>
            <S.Container>
              <Row type="flex" justify="space-between" gutter={20}>
                <S.LogoContainer to="/" aria-label="homepage" onClick={()=> handleOptionClick("/")}>
                  <SvgIcon src="logo.png" width={45} height={90}/>
                </S.LogoContainer>
                <S.NotHidden>
                  <MenuItem arrBarOptions={arrBarOptions}/>
                </S.NotHidden>
                <S.Burger onClick={showDrawer}>
                  <S.Outline />
                </S.Burger>
              </Row>
              <CSSTransition
                in={!isSmallScreen || isNavVisible}
                timeout={350}
                classNames="NavAnimation"
                unmountOnExit
              >
                <Drawer closable={false} visible={visible} onClose={onClose}>
                  <Col style={{ marginBottom: "2.5rem" }}>
                    <S.Label onClick={onClose}>
                      <Col span={12}>
                        <S.Menu>Menu</S.Menu>
                      </Col>
                      <Col span={12}>
                        <S.Outline padding="true" />
                      </Col>
                    </S.Label>
                  </Col>
                  <MenuItem arrBarOptions={arrBarOptions}/>
                </Drawer>
              </CSSTransition>
            </S.Container>
          </S.Header>    
        )
      }}
    </Consumer>
 );
};

export default withTranslation()(Navbar);
