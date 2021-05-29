import styled from "styled-components";

export const LeftContentBlock = styled.section`
  position: relative;
  padding: 10rem 0 8rem;

  @media only screen and (max-width: 768px) {
    padding: 4rem 0 4rem;
  }
`;

export const MinTitle = styled.h6`
  font-size: 1rem;
  line-height: 1rem;
  padding: 0.5rem 0;
  text-align: center;
  font-family: "Permanent Marker", cursive;
  color: grey;
`;

export const MinPara = styled.p`
  font-size: 1rem;
  margin-left: 1rem;
  color: grey;
`;
