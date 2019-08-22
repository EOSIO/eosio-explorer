import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import { StandardTemplate } from 'templates';
import { establishWebsocketConnectionStart } from './CheckShipVersionPageReducer';
import { CardStyled } from 'styled';
import styled from 'styled-components';
import { LoadingSpinner } from 'components';

const PopUpTitleStyled = styled.div`
  font-size: 25px;  
  font-weight: bold;
  margin: 10px 0 20px 0;
`

const InfoModalWrapper = styled.div`
  position: fixed;
  color: red;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  z-index: 1021;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1030;
  top: 0;
  left: 0;
  background: #443f54;
  opacity: 0.9;
`

const WelcomeModalCard = styled(CardStyled)`
  position: relative;
  z-index: 1050;
  padding: 18px 24px;
  max-width: 745px;
  min-height: 367px;
`

const LoadinSpinnerDivStyled = styled.div`
  z-index: 10000 !important;
`


class CheckShipVersionPage extends Component {

  constructor(props) {
    super(props);
    let host = new URL(window._env_.NODE_PATH).hostname;    
    console.log("window._env_.NODE_PATH ",window._env_.NODE_PATH);
    props.establishWebsocketConnectionStart(host);
  }

  render() {
    const { checkShipVersionPage: {isChecking, data} } = this.props;

    return (
      <StandardTemplate>
        <div className="CheckShipVersionPage">
          { isChecking 
            ? <InfoModalWrapper><Background /><LoadinSpinnerDivStyled><LoadingSpinner /></LoadinSpinnerDivStyled></InfoModalWrapper>
            : data.payload
              ? this.props.push(`/${this.search}`)
              : <InfoModalWrapper>
                <WelcomeModalCard>                    
                  <PopUpTitleStyled>
                    Error
                  </PopUpTitleStyled>
                  <p>
                    SHiP plugin is not enabled on the node <b>{this.url}</b> you are trying to connect to.
                  </p>                    
                  <p>
                    Run the `eosio-explorer init` command again with a valid endpoint.
                  </p>
                  <p>
                    Please go through the pre-requisites on our GitHub page: <a href="https://github.com/EOSIO/eosio-explorer" target="_blank" rel="noopener noreferrer">https://github.com/EOSIO/eosio-explorer</a>
                  </p>                   
                </WelcomeModalCard>
                <Background />
              </InfoModalWrapper>
          }                   
        </div>
      </StandardTemplate>
    );
  }
}

export default connect(
  ({ checkShipVersionPage, endpoint, router }) => ({
    checkShipVersionPage, 
    endpoint,
    router
  }),
  {
    establishWebsocketConnectionStart,
    push
  } 
)(CheckShipVersionPage);
