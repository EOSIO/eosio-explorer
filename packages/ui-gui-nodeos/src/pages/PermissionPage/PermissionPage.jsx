import React, { Component } from 'react';
import { 
  CardBody, ButtonGroup, Row, Col, UncontrolledTooltip
} from 'reactstrap';
import cogoToast from 'cogo-toast';

import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import CreateAccount from './components/CreateAccount';
import Permissionlist from './components/Permissionlist';
import ImportAccount from './components/ImportAccount';

import { panelSelect } from './PermissionPageReducer';
import { fetchStart, accountClear } from 'reducers/permission';
import styled from 'styled-components';
import { PageTitleDivStyled, CardStyled, ButtonPrimary, ButtonSecondary, InputStyled} from 'styled';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`
const CustomButton = styled(ButtonSecondary)`
  padding-top: 4px;
  line-height: 15px;
`

class PermissionPage extends Component {

  constructor(props) {
    super(props);
    props.panelSelect("permission-list");
  }

  render() {

    const { panelSelect, panel, accountClear, fetchStart } = this.props;

    // Initialize local redux store state, then re-fetch MongoDB permissions
    function reInitialize () {
      accountClear();
      fetchStart();
      cogoToast.success("Successfully re-initialized the local storage state", {
        heading: 'Account Storage Reinitialization',
        position: 'bottom-center'
      });
    }
    
    return (
      <StandardTemplate>
        <div className="PermissionPage animated fadeIn">          
          <Row>
            <Col sm="2"></Col>
            <Col sm="8">
              <Row>
                <Col sm="12">
                  <PageTitleDivStyled>Manage Accounts</PageTitleDivStyled>
                </Col>
              </Row>
              <Row>
                <Col sm="12">
                  <FirstCardStyled>                  
                  <CardBody>
                      <Row className="clearfix">
                        <Col sm={12}>
                          { panel === "permission-list"
                            ? <ButtonGroup className="float-right">
                                <ButtonPrimary id="CreateAccountBtn" onClick={()=>{panelSelect("create-account")}}>Create Account</ButtonPrimary>
                                <CustomButton id="ResetPermissionBtn" onClick={()=>reInitialize()}>Reset All Permissions</CustomButton>
                              </ButtonGroup>
                            : <ButtonPrimary className="float-right" onClick={()=>{panelSelect("permission-list")}}>Back</ButtonPrimary>
                          }
                          <UncontrolledTooltip placement="top" target="ResetPermissionBtn">
                            All private keys are stored locally on your machine. Clicking this button will reinitialize 
                            your local storage into the app's default state before fetching accounts from your 
                            current MongoDB instance
                          </UncontrolledTooltip>
                          <UncontrolledTooltip placement="top" target="CreateAccountBtn">
                            Go to a panel that will generate private and public keys for your account
                          </UncontrolledTooltip>
                        </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col sm={12}>
                          { panel === "permission-list" ? <Permissionlist/>
                            : panel === "create-account" ? <CreateAccount/>
                            : <ImportAccount />
                          }
                        </Col>
                      </Row>
                  </CardBody>
                </FirstCardStyled>
                </Col>
              </Row>            
            </Col>
            <Col sm="2"></Col>
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
    fetchStart,
    accountClear
  }
)(PermissionPage);
