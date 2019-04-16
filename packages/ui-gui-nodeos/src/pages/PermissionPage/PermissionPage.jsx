import React, { Component } from 'react';
import { 
  CardBody, Row, Col, Tooltip
} from 'reactstrap';
import cogoToast from 'cogo-toast';

import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import BasicModal from 'components/BasicModal';
import CreateAccount from './components/CreateAccount';
import Permissionlist from './components/Permissionlist';
import ImportAccount from './components/ImportAccount';

import { panelSelect } from './PermissionPageReducer';
import { fetchStart, accountClear } from 'reducers/permission';
import styled from 'styled-components';
import { PageTitleDivStyled, CardStyled, ButtonGroupSeperated, ButtonPrimary, ButtonSecondary } from 'styled';

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

    this.state = {
      resetTooltip: false,
      createTooltip: false,
      modalIsOpen: false
    }

    props.panelSelect("permission-list");
    window.scrollTo(0,0);

  }

  toggleResetTooltip () {
    this.setState({
      resetTooltip: !this.state.resetTooltip
    })
  };

  toggleModal () {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    })
  };

  render() {

    const { panelSelect, panel, accountClear, fetchStart, endpoint: { path } } = this.props;

    // Initialize local redux store state, then re-fetch MongoDB permissions
    function reInitialize () {
      accountClear(path);
      fetchStart();
      cogoToast.success("Successfully re-initialized the local storage state", {
        heading: 'Account Storage Reinitialization',
        position: 'bottom-center'
      });
    }

    // Change panel 
    function changePanel (panel) {
      panelSelect(panel);
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
                          <ButtonGroupSeperated className="float-right"
                            style={{display: (panel === "permission-list") ? 'block' : 'none'}}>
                                <ButtonPrimary id="CreateAccountBtn" onClick={()=>{changePanel("create-account")}}>Create Account</ButtonPrimary>
                                <CustomButton id="ResetPermissionBtn" onClick={()=>this.toggleModal()}>Reset All Permissions</CustomButton>
                          </ButtonGroupSeperated>
                          <ButtonPrimary className="float-right" onClick={()=>{changePanel("permission-list")}}
                            style={{display: (panel === "permission-list") ? 'none' : 'block'}}
                            >
                            Back
                          </ButtonPrimary>
                          <Tooltip placement="top" target="ResetPermissionBtn"
                            isOpen={this.state.resetTooltip && panel === "permission-list"}
                            toggle={()=>this.toggleResetTooltip()}
                            delay={{show: 0, hide: 0}}
                            trigger="hover"
                            autohide={true}>
                            All private keys are stored locally on your machine. Clicking this button will
                            revert the local storage to its default state. This means all your
                            currently stored private keys will be cleared!
                          </Tooltip>
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
        {
          this.state.modalIsOpen && (
            <BasicModal header="Confirmation to Reset all Permissions"
              toggle={()=>this.toggleModal()}
              open={this.state.modalIsOpen}
              handleConfirm={()=>{this.toggleModal(); reInitialize();}}
              >
              Are you sure you want to reset all permissions? You will <b>permanently</b> lose all your private keys in the local storage!
            </BasicModal>
          )
        }
      </StandardTemplate>
    );
  }
}

export default connect(
  ({ permission, permissionPage: { panel }, endpoint }) => ({
    permission, panel, endpoint
  }),
  {
    panelSelect,
    fetchStart,
    accountClear
  }
)(PermissionPage);
