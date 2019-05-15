import React from 'react';
import { Container } from 'reactstrap';

import { Header, HelpFAB, ConsoleLogger } from 'components';
import styled from 'styled-components';

import {
  AppHeader
} from '@coreui/react';

const StandardTemplateStyled = styled.div`
  .app-header {
    height: 80px;
    border-bottom: solid 3px #443f54;
    
    + .app-body {
        margin-top: 89px;
        margin-bottom: 50px;
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
  </StandardTemplateStyled>
)

export default StandardTemplate;
