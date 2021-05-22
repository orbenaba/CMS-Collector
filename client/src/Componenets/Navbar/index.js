// react modules
import { useState, useEffect, Fragment } from "react";
import { Row, Col, Drawer } from "antd";
import { CSSTransition } from "react-transition-group";
import { withTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from "axios";

// styling
import * as S from "./styles";

// custom modules
import SvgIcon from "../Shared/SvgIcon";
import Button from "../Shared/Button";
import {Consumer} from "../../Context"

// Helper Functions
import {IsLoggedIn} from "../../Helpers/Generals.Helpers"


const Navbar = ({ props }) => {
  const location = useLocation();
  const history = useHistory();
  const [isNavVisible] = useState(false);
  const [isSmallScreen] = useState(false);
  const [visible, setVisibility] = useState(false);
  const [currentBar, setCurrentBar] = useState(location.pathname);

  useEffect(()=> {
    if(currentBar && currentBar != "/") {
      // If the current bar is not home
      console.log("currentBar =", `label-id-${currentBar.slice(1)}`)
      let element = document.getElementById(`label-id-${currentBar.slice(1)}`);
      if(element) {
        console.log("Found")
        let domElementStyleRef = ReactDOM.findDOMNode(element).style;
        domElementStyleRef.borderBottom = "5px solid red";
        domElementStyleRef.padding = "0.5rem";
        domElementStyleRef.color = "red";
      }
    }
  }, [currentBar]);


  // Event Handlers
  const showDrawer = () => {
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };


  const handleOptionClick = (sPath) => {
    // Saving unnecessaries loadings
    if(location.pathname !== sPath) {
      setCurrentBar(sPath)
      history.push(sPath);
    }
  }

  const handleClickOnAccountDetails = () => {
    history.push("/change-details");
  }

  const IsInHomePage = () => {
    return history.location.pathname === "/";
  }

  const MenuItem = ({ arrBarOptions, username }) => {
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
  
    // Dont support click event for not auth users
    let HelloButton = (
      <S.Span>
        <Button>Welcome</Button>
      </S.Span>
    )
    if (username) {
      HelloButton = (
        <S.Span>
          <Button onClick={handleClickOnAccountDetails}>Hello {username}</Button>
        </S.Span>
      )
    }

    return (
      <Fragment>
        {scrollToAbout}
        {
            arrBarOptions.map(objBarOption => {
              return (
                <S.CustomNavLinkSmall onClick={()=> handleOptionClick(objBarOption.path)}>
                  <S.Span id={`label-id-${objBarOption.label}`}>{objBarOption.label}</S.Span> 
                </S.CustomNavLinkSmall>
              )
            })
          }
        

        <S.CustomNavLinkSmall
          style={{ width: "180px" }}
        >
          
          {HelloButton}

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
            path: "/Login"
          },
          {
            label: "Register",
            path: "/Register"
          }
        ]
        if(IsLoggedIn(user)) {
          arrBarOptions = [
            {
              label: "Scan",
              path: "/Scan"
            },
            {
              label: "Activity",
              path: "/Activity"
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
                  <MenuItem arrBarOptions={arrBarOptions} username={user.username}/>
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
                  <MenuItem arrBarOptions={arrBarOptions} username={user.username}/>
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
