import IntroContent from "./content/IntroContent.json";
import MiddleBlockContent from "./content/MiddleBlockContent.json";
import AboutContent from "./content/AboutContent.json";

import MiddleBlock from "./components/MiddleBlock";
import Container from "../Shared/Container";
import ScrollToTop from "../Shared/ScrollToTop";

import Welcome from "./Welcome";
import  {Consumer} from "../../Context";

import About from "./About";

import {IsLoggedIn} from "../../Helpers/Generals.Helpers";

const Landing = () => {
  return (
    <Consumer>
      {value => {
        const {user} = value.state;
        let isAuth = IsLoggedIn(user);

        return (
          <Container>
          <ScrollToTop />
          <Welcome
            first="true"
            title={IntroContent.title}
            content={IntroContent.text}
            button={IntroContent.button}
            icon="landing1.png"
            id="intro"
            isAuth={isAuth}
          />
          <MiddleBlock
            title={MiddleBlockContent.title}
            content={MiddleBlockContent.text}
            button={MiddleBlockContent.button}
            isAuth={isAuth}
          />
          <About 
              type="left"
              title={AboutContent.title}
              content={AboutContent.text}
              section={AboutContent.section}
              id="about"
          />
        </Container>
        )
      }}
    </Consumer>
);
};

export default Landing;
