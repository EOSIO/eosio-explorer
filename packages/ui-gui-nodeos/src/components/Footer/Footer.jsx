import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { BoxMiniSocial } from './components';
import MediaQueries from 'consts/media-queries';
import blockone_logo from './images/logo_blockone.svg';
import sectionSocialJson from './json/sectionSocial.json';

const Wrapper = styled.div`
  font-size: 12px;
  color: #ffffff;
  background: #443f54;
  padding: 90px 0 60px;
  ${MediaQueries.LAPTOP} {
    padding: 69px 0 60px;
  }
  ul {
    list-style: none;
  }
  a {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
    cursor: pointer;
    color: inherit;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1566px;
  padding: 0 100px;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;

const Col = styled.div`
  max-width: 100%;
  flex-basis: 0;
  flex-grow: 1;
  li{
    font-weight: 500;
  }
`;

const BlockOneCol = styled(Col)`

  flex: 1 0 265px;
  padding-bottom: 50px;
  ${MediaQueries.LAPTOP} {
    flex: 1 1 100%;
  }
`;

const EosioCol = styled(Col)`
  flex: 0 0 200px;
  padding-bottom: 120px;
  ${MediaQueries.LAPTOP} {
    padding-bottom: 50px;
  }
  a{
    font-size: 16px;
    line-height: 30px;
    &:hover{
      text-decoration: underline;
    }
  }
`;

const InfoCol = styled(EosioCol)`
  flex: 0 0 185px;
`;

const SocialIconsCol = styled(Col)`
  flex: 0 0 276px;
  > ul > li:last-child {
    position: relative;
    left: -10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 265px;
  }
`;

const SmallTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.75px;
  margin-bottom: 16px;
`

const CopyRightCol = styled(Col)`
  color: #ffffff;
  font-size: 12px;
  flex-basis: 50%;
`;

const SupportCol = styled(Col)`
  text-align: right;
  flex-basis: 50%;
  a {
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }

  span {
    padding: 0 8px;
    color: #ffffff;
  }
`;

const Footer = ({
    renderDataList = sectionSocialJson,
}) => (
  // <!--Footer section-->
  <Wrapper className="Footer">
    <Container>
      <Row>
        <BlockOneCol>
          <a href="//block.one" target="_blank" rel="noopener noreferrer">
            <img src={blockone_logo} alt="block.one"/>
          </a>
        </BlockOneCol>
        <EosioCol>
          <ul>
            <li>
              <SmallTitle>EOSIO</SmallTitle>
            </li>
            <li>
              <Link to="//eos.io/resources" target="_blank">Resources</Link>
            </li>
            <li>
              <Link to="//developers.eos.io/" target="_blank">Developer Portal</Link>
            </li>
            <li>
              <Link to="//battles.eos.io/" target="_blank">Elemental Battles</Link>
            </li>
            <li>
              <Link to="//eos.io/faq" target="_blank">FAQ</Link>
            </li>
          </ul>
        </EosioCol>
        <InfoCol>
          <ul>
            <li>
              <SmallTitle>MORE INFO</SmallTitle>
            </li>
            <li>
              <Link to="//vc.eos.io/" target="_blank" >EOS VC</Link>
            </li>
            <li>
              <Link to="//block.one/careers/" target="_blank">Careers</Link>
            </li>
            <li>
              <Link to="//eos.io/contact-us" target="_blank">Contact Us</Link>
            </li>
          </ul>
        </InfoCol>
        <SocialIconsCol>
          <ul>
            <li>
              <SmallTitle>SOCIAL</SmallTitle>
            </li>
            <li>
              {renderDataList.map((renderData, index) => <BoxMiniSocial key={index} {...renderData}/>)}
            </li>
          </ul>
        </SocialIconsCol>
      </Row>
      <Row>
        <CopyRightCol>
          <span>Copyright © 2019 Block.one. All rights reserved.</span>
        </CopyRightCol>
        <SupportCol>
          <a href="mailto:support@block.one">support@block.one</a>
          <span> | </span>
          <Link to="/terms-of-use">Terms of Use</Link>
          <span> | </span>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </SupportCol>
      </Row>
    </Container>
  </Wrapper>
)

export default Footer;
