import './BlocklistPage.scss';

import React, { Component } from 'react';
import { StandardTemplate } from 'templates';
import Blocklist from './components/Blocklist';


class BlocklistPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="BlocklistPage">
          <Blocklist/>
        </div>
      </StandardTemplate>
    );
  }
}

export default BlocklistPage;
