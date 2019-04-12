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

const Permissionlist = (props) => {

  let { 
    permission: { isFetching, data }, 
    panelSelect, defaultSet 
  } = props;
  let { list, defaultId } = data;
  let newList = (list.length > 0) ? list.reduce((result, permission) => {
    if (permission.account) {
      result[permission.account] = result[permission.account] || [];
      result[permission.account].push(permission);
      return result;
    }
    else
      return null;
  }, Object.create({})) : null;

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
                                      newList && Object.keys(newList).map((account) => (
                                        (newList[account][0] && newList[account][0].private_key) &&
                                        <tbody className="accountRow" key={account}>
                                          <tr>
                                            <td width="60%">
                                              <AccountTable borderless>
                                                <tbody>
                                                  <AccountRow>
                                                    <td className="radio" width="20%">
                                                      <RadioButtonDivStyled>
                                                        <label className="radioContainer">
                                                          <input name={newList[account][0]._id}
                                                            type="radio"
                                                            checked={newList[account][0]._id === defaultId ? true : false}
                                                            onClick={() => setAsDefault(newList[account][0]._id, newList[account][0].account, newList[account][0].permission)}
                                                            readOnly />
                                                          <span className="checkmark"></span>
                                                        </label>
                                                      </RadioButtonDivStyled>
                                                    </td>
                                                    <td className="permissionLabel" width="80%">
                                                      <PermissionLink to={`/account/${newList[account][0].account}`}>
                                                        {newList[account][0].account}@{newList[account][0].permission}
                                                      </PermissionLink>
                                                    </td>
                                                  </AccountRow>
                                                  <AccountRow>
                                                    <td className="radio" width="20%">
                                                      <RadioButtonDivStyled>
                                                        <label className="radioContainer">
                                                          <input name={newList[account][1]._id}
                                                            type="radio"
                                                            checked={newList[account][1]._id === defaultId ? true : false}
                                                            onClick={() => setAsDefault(newList[account][1]._id, newList[account][1].account, newList[account][1].permission)}
                                                            readOnly />
                                                          <span className="checkmark"></span>
                                                        </label>
                                                      </RadioButtonDivStyled>
                                                    </td>
                                                    <td className="permissionLabel" width="80%">
                                                      <PermissionLink to={`/account/${newList[account][1].account}`}>
                                                        {newList[account][1].account}@{newList[account][1].permission}
                                                      </PermissionLink>
                                                    </td>
                                                  </AccountRow>
                                                </tbody>
                                              </AccountTable>
                                            </td>
                                            <EditButtonCell width="40%">
                                              <ButtonPrimary 
                                                    style={{float:'right', marginRight:'5%'}}
                                                    onClick={() => getKeysData(newList[account][0].account, list)}
                                                    block
                                                    >
                                                    Edit
                                                  </ButtonPrimary>
                                            </EditButtonCell>
                                          </tr>
                                        </tbody>
                                      ))
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
                                      newList && Object.keys(newList).map((account) => (
                                        (newList[account][0] && !newList[account][0].private_key) &&
                                        <tbody className="accountRow" key={account}>
                                          <tr>
                                            <td width="60%">
                                              <AccountTable borderless>
                                                <tbody>
                                                  <AccountRow>
                                                    <td className="radio" width="20%">
                                                    </td>
                                                    <td className="permissionLabel" width="80%">
                                                      <PermissionLink to={`/account/${newList[account][0].account}`}>
                                                        {newList[account][0].account}@{newList[account][0].permission}
                                                      </PermissionLink>
                                                    </td>
                                                  </AccountRow>
                                                  <AccountRow>
                                                    <td className="radio" width="20%">
                                                    </td>
                                                    <td className="permissionLabel" width="80%">
                                                      <PermissionLink to={`/account/${newList[account][1].account}`}>
                                                        {newList[account][1].account}@{newList[account][1].permission}
                                                      </PermissionLink>
                                                    </td>
                                                  </AccountRow>
                                                </tbody>
                                              </AccountTable>
                                            </td>
                                            <EditButtonCell width="40%">
                                              <ButtonPrimary 
                                                    style={{float:'right', marginRight:'5%'}}
                                                    onClick={() => getKeysData(newList[account][0].account, list)}
                                                    block
                                                    >
                                                    Edit
                                                  </ButtonPrimary>
                                            </EditButtonCell>
                                          </tr>
                                        </tbody>
                                      ))
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
  ({ permission, permissionPage: { panel }}) => ({
    permission, panel
  }),
  {
    fetchStart,
    defaultSet,
    accountImport,
    panelSelect
  }
)(Permissionlist);
