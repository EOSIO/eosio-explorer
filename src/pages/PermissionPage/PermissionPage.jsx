import React, { Component } from 'react';
import { 
  Row, Col
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
import { PageTitleDivStyled, ButtonGroupSeperated, ButtonPrimary, ButtonSecondary, ToolTipStyled } from 'styled';

const CustomButtonPrimary = styled(ButtonPrimary)`
  padding-top: 4px;
  line-height: 15px;
`

const CustomButtonSecondary = styled(ButtonSecondary)`
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

    const { panelSelect, panel, accountClear, fetchStart, payload } = this.props;
    const { chain_id } = payload || { chain_id: '32b303dbe6bc3cf9a0d28fbdc95ea3cd18310923ac20f11fab3ca5ab4f18f135' };

    // Initialize local redux store state, then re-fetch MongoDB permissions
    function reInitialize () {
      accountClear(chain_id);
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
        <div className="PermissionPage ">          
          <Row>
            <Col sm="12">
              <Row>
                <Col sm="12">
                  <PageTitleDivStyled>Manage Accounts Page</PageTitleDivStyled>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <ButtonGroupSeperated className="float-right"
                    style={{display: (panel === "permission-list") ? 'block' : 'none'}}>
                    <CustomButtonPrimary id="CreateAccountBtn" onClick={()=>{changePanel("create-account")}}>Create Account</CustomButtonPrimary>
                    <CustomButtonSecondary id="ResetPermissionBtn" onClick={()=>this.toggleModal()}>Reset All Permissions</CustomButtonSecondary>
                  </ButtonGroupSeperated>
                  <ToolTipStyled placement="bottom" target="ResetPermissionBtn"
                    isOpen={this.state.resetTooltip && panel === "permission-list"}
                    toggle={()=>this.toggleResetTooltip()}
                    delay={{show: 0, hide: 0}}
                    trigger="hover"
                    autohide={true}>
                    All private keys are stored locally on your machine. Clicking this button will
                    revert the local storage to its default state. This means all your
                    currently stored private keys will be cleared!
                  </ToolTipStyled>
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
            </Col>
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
  ({ permission, permissionPage: { panel }, infoPage: { blockchainInfo: { data: { payload } }} }) => ({
    permission, panel, payload
  }),
  {
    panelSelect,
    fetchStart,
    accountClear
  }
)(PermissionPage);
