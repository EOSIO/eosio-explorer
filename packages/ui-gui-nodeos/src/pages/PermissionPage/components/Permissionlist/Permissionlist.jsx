import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CardBody, Table } from 'reactstrap';
import cogoToast from 'cogo-toast';

import { connect } from 'react-redux';
import { fetchStart, accountImport, defaultSet } from 'reducers/permission';
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';
import { RadioButtonDivStyled, CardStyled, CardHeaderStyled, ButtonPrimary } from 'styled';

const InfoDiv = styled.div`
  color: #181c1e;
  background-color: #d5d7d8;
  border-color: #c5c6c8;
  padding: 20px;  
  margin-bottom: 20px;
  border-radius: 3px;
`

const PermissionTable = styled(Table)`
  tr {
    border: solid 1px #e8ebf0;
  }

  tbody:nth-of-type(even) {
    background-color: #fbfbfc;
  }
`

const AccountTable = styled(Table)`
  margin-bottom: 0 !important;
`

const AccountRow = styled.tr`
  border: none !important;

  .permissionLabel {
    margin-left: 30px;
    text-align: left;
    vertical-align: middle;
  }
`

const EditButtonCell = styled.td`
  vertical-align: middle !important;
`

const PermissionLink = styled(Link)`
  :hover {
    font-weight: strong;
    color: 4d9cc3;
  }
`

// Each account must have two permissions, so we multiply number of accounts by 2
// N = 100
const MAX_ACCOUNTS_TO_SHOW = 100 * 2;

// If baseListLength < (MAX_ACCOUNTS_TO_SHOW - (currentNumberOfDefaultAccounts * 2))
// Then we just show everything
const calculateMaxAccountsToShow = (baseListLength, currentNumberOfDefaultAccounts) => 
  (baseListLength - (MAX_ACCOUNTS_TO_SHOW - (currentNumberOfDefaultAccounts * 2)))

const Permissionlist = (props) => {

  let { 
    permission: { isFetching, data },
    panelSelect, defaultSet 
  } = props;
  let { list, defaultId } = data;
  let clonedList = list.slice(0);

  let baseDefaultAccountsList = (clonedList.length > 0) ? clonedList.reduce((result, permission) => {
    if (permission.account && permission.private_key) {
      result[permission.account] = result[permission.account] || [];
      result[permission.account].push(permission);
    } 
    return result;
  }, Object.create({})) : null;
  let defaultAccountsList = (Object.keys(baseDefaultAccountsList || {}).length > 0) ? 
    Object.keys(baseDefaultAccountsList).sort().map(key => baseDefaultAccountsList[key]) : {};
  let numberOfDefaultAccounts = Object.keys(defaultAccountsList || {}).length;
  
  let baseImportAccountsList = (clonedList.length > 0) ? clonedList.reduce((result, permission, idx) => {
    if (permission.account && !permission.private_key && idx >= calculateMaxAccountsToShow(clonedList.length, numberOfDefaultAccounts)) {
      result[permission.account] = result[permission.account] || [];
      result[permission.account].push(permission);
    }
    return result;
  }, Object.create({})) : null;
  let importAccountsList = (Object.keys(baseImportAccountsList || {}).length > 0) ?
     Object.keys(baseImportAccountsList).sort().map(key => baseImportAccountsList[key]) : {};
  let numberOfImportAccounts = Object.keys(importAccountsList || {}).length;

  useEffect(()=>{
    props.fetchStart();
  }, [])

  function getKeysData (accName, list) {
    const keysData = list.filter(acct => acct["account"] === accName);
    props.accountImport(keysData);
    panelSelect("import-account");
  }

  function setAsDefault (id, accName, permission) {
    let msg = `Successfully set ${accName}@${permission} as the default account`;
    defaultSet(id);
    if (defaultId !== id)
      cogoToast.success(msg, {
        heading: 'Account Changed',
        position: 'bottom-center',
        hideAfter: 2
      });
  }

  function containsOnlyActiveOrOwner (permissionList) {
    let _permissionOneCorrect = false;
    let _permissionTwoCorrect = false;

    if (permissionList.length > 0) {
      _permissionOneCorrect = permissionList[0].permission === 'owner' || permissionList[0].permission === 'active';
      _permissionTwoCorrect = permissionList[1].permission === 'owner' || permissionList[1].permission === 'active';
    }

    return _permissionOneCorrect && _permissionTwoCorrect;
  }

  return (
    <div className="Permissionlist">

      <div>{ isFetching   ? `loading...`
                          : <div>
                              <CardStyled>
                                <CardHeaderStyled>
                                  Default Signature Account
                                </CardHeaderStyled>
                                <CardBody>
                                  <InfoDiv>
                                    These are your currently available accounts that possess both public and private keys. They can be
                                    used for signing transactions and pushing actions. 
                                    The <b>eosio</b> account owns the system contract responsible for numerous important functions, so please
                                    be aware that you can not deploy new contracts locally under that permission. 
                                    Click the "Edit" button to change an account's private key. Click the radio button to set the default account for authorizing actions.
                                  </InfoDiv>
                                  <PermissionTable borderless>
                                    {
                                      defaultAccountsList && numberOfDefaultAccounts > 0 
                                        ? Object.keys(defaultAccountsList).map((account) => (
                                        (defaultAccountsList[account] && 
                                          defaultAccountsList[account].length === 2 && 
                                          defaultAccountsList[account][0].private_key &&
                                          containsOnlyActiveOrOwner(defaultAccountsList[account])
                                          ) &&
                                        <tbody className="accountRow" key={account}>
                                          <tr>
                                            <td width="60%">
                                              <AccountTable borderless>
                                                <tbody>
                                                  <AccountRow>
                                                    <td className="radio" width="20%">
                                                      <RadioButtonDivStyled>
                                                        <label className="radioContainer">
                                                          <input name={defaultAccountsList[account][0]._id}
                                                            type="radio"
                                                            checked={defaultAccountsList[account][0]._id === defaultId ? true : false}
                                                            onClick={() => setAsDefault(defaultAccountsList[account][0]._id, 
                                                              defaultAccountsList[account][0].account, 
                                                              defaultAccountsList[account][0].permission)}
                                                            readOnly />
                                                          <span className="checkmark"></span>
                                                        </label>
                                                      </RadioButtonDivStyled>
                                                    </td>
                                                    <td className="permissionLabel" width="80%">
                                                      <PermissionLink to={`/account/${defaultAccountsList[account][0].account}`}>
                                                        {defaultAccountsList[account][0].account}@{defaultAccountsList[account][0].permission}
                                                      </PermissionLink>
                                                    </td>
                                                  </AccountRow>
                                                  <AccountRow>
                                                    <td className="radio" width="20%">
                                                      <RadioButtonDivStyled>
                                                        <label className="radioContainer">
                                                          <input name={defaultAccountsList[account][1]._id}
                                                            type="radio"
                                                            checked={defaultAccountsList[account][1]._id === defaultId ? true : false}
                                                            onClick={() => setAsDefault(defaultAccountsList[account][1]._id, 
                                                              defaultAccountsList[account][1].account, 
                                                              defaultAccountsList[account][1].permission)}
                                                            readOnly />
                                                          <span className="checkmark"></span>
                                                        </label>
                                                      </RadioButtonDivStyled>
                                                    </td>
                                                    <td className="permissionLabel" width="80%">
                                                      <PermissionLink to={`/account/${defaultAccountsList[account][1].account}`}>
                                                        {defaultAccountsList[account][1].account}@{defaultAccountsList[account][1].permission}
                                                      </PermissionLink>
                                                    </td>
                                                  </AccountRow>
                                                </tbody>
                                              </AccountTable>
                                            </td>
                                            <EditButtonCell width="40%">
                                              <ButtonPrimary 
                                                    style={{float:'right', marginRight:'5%'}}
                                                    onClick={() => getKeysData(defaultAccountsList[account][0].account, list)}
                                                    block
                                                    >
                                                    Edit
                                                  </ButtonPrimary>
                                            </EditButtonCell>
                                          </tr>
                                        </tbody>
                                      ))
                                      : <tbody>
                                        <tr>
                                          <td width="100%" style={{textAlign:"center"}}>
                                            <strong>No accounts available</strong>
                                          </td>
                                        </tr>
                                      </tbody>
                                    }
                                  </PermissionTable>
                                </CardBody>
                              </CardStyled>                              
                                <CardStyled>
                                  <CardHeaderStyled>Import Account</CardHeaderStyled>
                                  <CardBody>
                                    <InfoDiv>
                                      The accounts in this panel do not have private keys assigned to them yet. You can click 
                                      the "Import Keys" button to assign your private keys to these accounts. <b>Note:</b> Be 
                                      sure that the private keys you import to the accounts here correspond to the public
                                      key fetched from the MongoDB. Otherwise you won't be able to do anything with them, even
                                      if you import keys.
                                    </InfoDiv>
                                    <PermissionTable borderless>
                                    {
                                      (importAccountsList && numberOfImportAccounts > 0) 
                                      ? Object.keys(importAccountsList).map((account) => (
                                        (importAccountsList[account] &&
                                          importAccountsList[account].length === 2 && 
                                          !importAccountsList[account][0].private_key &&
                                          containsOnlyActiveOrOwner(importAccountsList[account])
                                          ) &&
                                        <tbody className="accountRow" key={account}>
                                          <tr>
                                            <td width="60%">
                                              <AccountTable borderless>
                                                <tbody>
                                                  <AccountRow>
                                                    <td className="radio" width="20%">
                                                    </td>
                                                    <td className="permissionLabel" width="80%">
                                                      <PermissionLink to={`/account/${importAccountsList[account][0].account}`}>
                                                        {importAccountsList[account][0].account}@{importAccountsList[account][0].permission}
                                                      </PermissionLink>
                                                    </td>
                                                  </AccountRow>
                                                  <AccountRow>
                                                    <td className="radio" width="20%">
                                                    </td>
                                                    <td className="permissionLabel" width="80%">
                                                      <PermissionLink to={`/account/${importAccountsList[account][1].account}`}>
                                                        {importAccountsList[account][1].account}@{importAccountsList[account][1].permission}
                                                      </PermissionLink>
                                                    </td>
                                                  </AccountRow>
                                                </tbody>
                                              </AccountTable>
                                            </td>
                                            <EditButtonCell width="40%">
                                              <ButtonPrimary 
                                                    style={{float:'right', marginRight:'5%'}}
                                                    onClick={() => getKeysData(importAccountsList[account][0].account, list)}
                                                    block
                                                    >
                                                    Edit
                                                  </ButtonPrimary>
                                            </EditButtonCell>
                                          </tr>
                                        </tbody>
                                      ))
                                      : <tbody>
                                        <tr>
                                          <td width="100%" style={{textAlign:"center"}}>
                                            <strong>No accounts available</strong>
                                          </td>
                                        </tr>
                                      </tbody>
                                    }
                                  </PermissionTable>
                                  </CardBody>
                                </CardStyled>
                                
                              </div>
              }
      </div>
    </div>
  );
}

export default connect(
  ({ permission, permissionPage: { panel } }) => ({
    permission, panel
  }),
  {
    fetchStart,
    defaultSet,
    accountImport,
    panelSelect
  }
)(Permissionlist);
