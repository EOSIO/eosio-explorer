import React, { Component } from 'react';
import { 
  Card, CardBody, CardHeader, 
  ButtonGroup, Button, Row, Col 
} from 'reactstrap';

import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import CreateAccount from './components/CreateAccount';
import Permissionlist from './components/Permissionlist';
import ImportAccount from './components/ImportAccount';

import { panelSelect } from './PermissionPageReducer';
import { accountClear } from 'reducers/permission';

class PermissionPage extends Component {
  render() {

    const { panelSelect, panel, accountClear } = this.props;
    
    return (
      <StandardTemplate>
        <div className="PermissionPage">
          <Row>
            <Col sm={{size: 4, offset: 4}} md={{size: 6, offset: 3}}>
              <Card>
              <CardHeader>
                Permission Page
              </CardHeader>
              <CardBody>
                  <Row className="clearfix">
                    <Col sm={12}>
                      { panel === "permission-list"
                        ? <ButtonGroup className="float-right">
                            <Button color="primary" onClick={()=>{panelSelect("create-account")}}>Create Account</Button>
                            <Button color="danger" onClick={()=>accountClear()}>Reset All Permissions</Button>
                          </ButtonGroup>
                        : <Button color="primary" className="float-right" onClick={()=>{panelSelect("permission-list")}}>Back</Button>
                      }
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm={12}>
                      { panel === "permission-list" ? <Permissionlist/>
                        : panel === "create-account" ? <CreateAccount/>
                        : <ImportAccount />
                      }
                    </Col>
                  </Row>
              </CardBody>
            </Card>
            </Col>
          </Row>
        </div>
      </StandardTemplate>
    );
  }
}

export default connect(
  ({ permission, permissionPage: { panel } }) => ({
    permission, panel,
  }),
  {
    panelSelect,
    accountClear
  }
)(PermissionPage);
