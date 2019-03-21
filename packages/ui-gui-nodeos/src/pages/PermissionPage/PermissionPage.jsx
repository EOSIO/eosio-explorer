import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';

import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import CreateAccount from './components/CreateAccount';
import Permissionlist from './components/Permissionlist';

import { panelSelect } from './PermissionPageReducer';

class PermissionPage extends Component {
  render() {

    const { panelSelect, panel } = this.props;
    console.log(panel);
    return (
      <StandardTemplate>
        <div className="PermissionPage">
          <Card>
            <CardHeader>
              Permission Page
            </CardHeader>
            <CardBody>
              { panel === "permission-list"
                ? <Button color="primary" onClick={()=>{panelSelect("create-account")}}>Create Account</Button>
                : <Button color="primary" onClick={()=>{panelSelect("permission-list")}}>Back</Button>
              }

              { panel === "permission-list"
                ? <Permissionlist/>
                : <CreateAccount/>
              }
            </CardBody>
          </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default connect(
  ({ permissionPage: { panel } }) => ({
    panel,
  }),
  {
    panelSelect
  }
)(PermissionPage);
