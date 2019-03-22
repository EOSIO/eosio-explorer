import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

import { StandardTemplate } from 'templates';
import Blocklist from './components/Blocklist';


class BlocklistPage extends Component {

  render() {

    return (
      <StandardTemplate>
        <div className="BlocklistPage animated fadeIn">
          <Card>
            <CardHeader>
              Block List Page
            </CardHeader>
            <CardBody>
              <Blocklist/>
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default BlocklistPage;
