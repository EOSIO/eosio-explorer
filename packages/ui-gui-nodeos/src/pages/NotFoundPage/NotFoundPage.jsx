import './NotFoundPage.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { StandardTemplate } from 'templates';

class NotFoundPage extends Component {

  render() {
    return (
      <StandardTemplate>
        <div className="NotFoundPage">
          <div className="high-block">
            <div>
              404 Not Found
            </div>
            <div>Scroll down</div>
            <div>
              <Link to={'/'}>Back to Landing Page</Link>
            </div>
          </div>
        </div>
      </StandardTemplate>
    );
  }
}

export default NotFoundPage;
