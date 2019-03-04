import './StandardTemplate.scss';

import React from 'react';

import { Footer, Header } from 'components';

const StandardTemplate = ({
  children = null,
}) => (
  <div className="StandardTemplate">
    <header>
      <Header/>
    </header>
    <main>
      {children}
    </main>
    <footer>
      <Footer/>
    </footer>
  </div>
)

export default StandardTemplate;
