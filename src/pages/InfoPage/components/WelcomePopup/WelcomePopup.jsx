import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CardStyled, ButtonPrimary, PageTitleDivStyled, CheckBoxDivStyled } from 'styled';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { toggleShowAgain, toggleSessionShowAgain } from './WelcomePopupReducer';

const InfoModalWrapper = styled.div`
  position: fixed;
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

const CloseButton = styled.button`
  position: absolute;
  top: 9px;
  right: 13px;
  border: none;
  background: transparent;
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
`

const InfoPortal = ({ children }) => {
  const modalRoot = document.getElementById('modal');
  const el = document.createElement('div');

  useEffect(() => {
    modalRoot.appendChild(el);
  });

  useEffect(() => {
    return () => modalRoot.removeChild(el);
  })

  return createPortal(children, el);
}

const WelcomePopup = ({ toggle, open, toggleShowAgain }) => {

  const closeModal = () => {
    const doNotShowAgain = document.getElementById('toggleCheck').checked;
    toggleShowAgain(doNotShowAgain);
    toggleSessionShowAgain(false);
    toggle();
  }

  return (
    <InfoPortal>
      {
        open && (
          <InfoModalWrapper>
            <WelcomeModalCard>
              <CloseButton onClick={() => closeModal()}>
                <img src="https://icon.now.sh/x/8ba5bf" alt="close" />
              </CloseButton>
              <PageTitleDivStyled>
                Welcome to EOSIO Labs™: EOSIO Explorer
              </PageTitleDivStyled>
              <p>EOSIO Labs™: EOSIO Explorer is an open source browser to observe activity of an EOSIO blockchain in a graphical
                interface and a set of development tools to speed up EOSIO smart contract and application development.
              </p>
              <p>Using EOSIO Labs™: EOSIO Explorer you can view blocks, transactions and actions on an EOSIO blockchain, manage
                developer accounts and permissions associated with them, upload and interact with smart contracts
                and much more.
              </p>
              <p>If you have any feedback or you&apos;d like to contribute to the source code of EOSIO Labs™: EOSIO Explorer -
                please follow our GitHub repository: <a href="https://github.com/EOSIO/eosio-explorer" target="_blank" rel="noopener noreferrer">https://github.com/EOSIO/eosio-explorer</a>
              </p>
              <CheckBoxDivStyled style={{marginTop: '31px'}}>
                <label className="checkboxContainer">
                  Don't show this message again
                  <input id="toggleCheck" type="checkbox"/>
                  <span className="checkmark"></span>
                </label>
              </CheckBoxDivStyled>
              <ButtonPrimary
                onClick={() => closeModal()}
                style={{
                  position: 'absolute',
                  bottom: '21px',
                  right: '19px'
                }}>
                OK
              </ButtonPrimary>
            </WelcomeModalCard>
            <Background />
          </InfoModalWrapper>
        )
      }
    </InfoPortal>
  )
}

export default connect(
  null,
  {
    toggleShowAgain,
    toggleSessionShowAgain
  }
)(WelcomePopup);
