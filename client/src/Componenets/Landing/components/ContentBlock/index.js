import RightContentBlock from "./RightContentBlock";

const ContentBlock = (props) => {
  if (props.type === "right") return <RightContentBlock {...props} />;
  return null;
};

export default ContentBlock;
