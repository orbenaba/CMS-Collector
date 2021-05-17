import IntroContent from "../content/IntroContent.json";
import MiddleBlockContent from "../content/MiddleBlockContent.json";
import AboutContent from "../content/AboutContent.json";

import ContentBlock from "../components/ContentBlock";
import MiddleBlock from "../components/MiddleBlock";
import Container from "../common/Container";
import ScrollToTop from "../common/ScrollToTop";


const Home = () => {
  return (
    <Container>
      <ScrollToTop />
      <ContentBlock
        type="right"
        first="true"
        title={IntroContent.title}
        content={IntroContent.text}
        button={IntroContent.button}
        icon="landing1.png"
        id="intro"
      />
      <MiddleBlock
        title={MiddleBlockContent.title}
        content={MiddleBlockContent.text}
        button={MiddleBlockContent.button}
      />
      <ContentBlock
        type="left"
        title={AboutContent.title}
        content={AboutContent.text}
        section={AboutContent.section}
          icon="landing1.png"
        id="about"
      />
    </Container>
  );
};

export default Home;
