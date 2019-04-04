import './StandardTemplate.scss';
import React from 'react';
import { Container } from 'reactstrap';

import { Footer, Header, HelpFAB, ConsoleLogger } from 'components';

import {
  AppHeader
} from '@coreui/react';

const StandardTemplate = ({
  children = undefined,
}) => (
  <div className="StandardTemplate app">
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
    <Footer/>
    <ConsoleLogger/>
  </div>
)

export default StandardTemplate;
