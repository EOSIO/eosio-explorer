import React from 'react';
import { Container } from 'reactstrap';

import { Header, Footer, HelpFAB, ConsoleLogger } from 'components';
import styled from 'styled-components';

import {
  AppHeader,
  AppFooter
} from '@coreui/react';

const StandardTemplateStyled = styled.div`
  .app-header {
    height: 80px;
    border-bottom: solid 3px #443f54;
    
    + .app-body {
        margin-top: 89px;
        margin-bottom: 25px;
    }
  }
`;

const StandardTemplate = ({
  children = undefined,
}) => (
  <StandardTemplateStyled className="app">
    <AppHeader fixed>
      <Header />
    </AppHeader>
    <div className="app-body">
      <HelpFAB />
      <main className="main">
        <Container fluid>
          {children}
        </Container>
      </main>
    </div>
    <ConsoleLogger/>
    <AppFooter>
      <Footer />
    </AppFooter>
  </StandardTemplateStyled>
)

export default StandardTemplate;
