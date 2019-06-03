import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CardBody, Table } from 'reactstrap';
import cogoToast from 'cogo-toast';
import { LoadingSpinner } from 'components';
import { connect } from 'react-redux';
import { fetchStart, accountImport, defaultSet } from 'reducers/permission';
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';
import { RadioButtonDivStyled, CardStyled, CardHeaderStyled, ButtonPrimary, InfoDivStyled } from 'styled';

const PermissionTable = styled(Table)`
  tr {
    border: solid 1px #e8ebf0;
  }

  tbody:nth-of-type(even) {
    background-color: #fbfbfc;
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

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
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
  

  //Seperate Permissions based on Private keys
  let listWithPrivateKey = [];
  let listWithoutPrivateKey = [];
  clonedList.map(eachPermission => {
    if(eachPermission.private_key !== undefined && eachPermission.private_key !== "" && eachPermission.private_key !== null){
      listWithPrivateKey.push(eachPermission);
    }else{      
      listWithoutPrivateKey.push(eachPermission);
    }
    return null;
  });


  let baseDefaultAccountsList = (clonedList.length > 0) ? clonedList.reduce((result, permission) => {
    if (permission.account && permission.private_key) {
      result[permission.account] = result[permission.account] || [];
      result[permission.account].push(permission);
    } 
    return result;
  }, Object.create({})) : null;
  let defaultAccountsList = (Object.keys(baseDefaultAccountsList || {}).length > 0) ? 
    Object.keys(baseDefaultAccountsList).sort().filter(key => baseDefaultAccountsList[key].length > 1).map(key => baseDefaultAccountsList[key]) : {};
  let numberOfDefaultAccounts = Object.keys(defaultAccountsList || {}).length;
  
  let baseImportAccountsList = (clonedList.length > 0) ? clonedList.reduce((result, permission, idx) => {
    if (permission.account && !permission.private_key && idx >= calculateMaxAccountsToShow(clonedList.length, numberOfDefaultAccounts)) {
      result[permission.account] = result[permission.account] || [];
      result[permission.account].push(permission);
    }
    return result;
  }, Object.create({})) : null;
  if (Object.keys(baseImportAccountsList || {}).length > 0)
    Object.keys(baseImportAccountsList).forEach(key => {
      if (baseImportAccountsList[key].length === 1) {
        let permission = baseImportAccountsList[key][0].permission;
        if (permission === 'active') {
          let missingPermission = clonedList.filter(item => item.permission === 'owner' && item.account === baseImportAccountsList[key][0].account)[0];
          baseImportAccountsList[key].push(missingPermission);
        } else {
          let missingPermission = clonedList.filter(item => item.permission === 'active' && item.account === baseImportAccountsList[key][0].account)[0];
          baseImportAccountsList[key].push(missingPermission);
        }
      }
    })
  let importAccountsList = (Object.keys(baseImportAccountsList || {}).length > 0) ?
     Object.keys(baseImportAccountsList).sort().map(key => baseImportAccountsList[key]) : {};
  let numberOfImportAccounts = Object.keys(importAccountsList || {}).length;

  useEffect(()=>{
    props.fetchStart();
  }, [])

  function getKeysData (permissionObj, list, panel) {
    const keysData = list.filter(acct => acct["account"] === permissionObj.account);   
    let editOrImportPermission = keysData.filter(eachPermission => eachPermission.permission === permissionObj.permission );
    console.log("editOrImportPermission ", editOrImportPermission);
    props.accountImport(editOrImportPermission);
    //props.accountImport(keysData);
    panelSelect("import-account-"+panel);
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

  function isDefaultEosio (eachPermission) {    
    // let _accountNameOne = (permissionList[0]) ?
    //   permissionList[0].account === 'eosio' : false;
    // let _accountNameTwo = (permissionList[1]) ?
    //   permissionList[1].account === 'eosio' : false;
    // let _accountOneId = (permissionList[0]) ?
    //   (permissionList[0]._id === '1' || permissionList[0]._id === '2') : false;
    // let _accountTwoId = (permissionList[1]) ?
    //   (permissionList[1]._id === '1' || permissionList[1]._id === '2') : false;

    //return _accountNameOne && _accountNameTwo && _accountOneId && _accountTwoId;

    //Also add the check for chain ID after discussion
    let result = eachPermission.account === 'eosio' && (eachPermission.permission === 'owner' || 'active') ? true : false;
    return result;
  }

  function containsOnlyActiveOrOwner (permissionList) {
    let _permissionOneCorrect = false;
    let _permissionTwoCorrect = false;

    if (permissionList.length > 0) {
      _permissionOneCorrect = (permissionList[0]) ?
        (permissionList[0].permission === 'owner' || permissionList[0].permission === 'active') : false;
      _permissionTwoCorrect = (permissionList[1]) ?
        (permissionList[1].permission === 'owner' || permissionList[1].permission === 'active') : false;
    }

    return _permissionOneCorrect && _permissionTwoCorrect;
  }

  return (
    <div className="Permissionlist">

      <div>{ isFetching   ? <LoadingSpinner />
                          : <div>
                              <FirstCardStyled>
                                <CardHeaderStyled>
                                  Default Signature Account
                                </CardHeaderStyled>
                                <CardBody>
                                  <InfoDivStyled>
                                    These are your currently available accounts that possess both public and private keys. They can be
                                    used for signing transactions and pushing actions. 
                                    The <b>eosio</b> account owns the system contract responsible for numerous important functions, so please
                                    be aware that you can not deploy new contracts locally under that permission. 
                                    Click the "Edit" button if you want to update or check your keys for these accounts. 
                                    Click the radio button to set the default account for authorizing actions.
                                  </InfoDivStyled>
                                  <PermissionTable borderless>
                                    {
                                      listWithPrivateKey.length > 0 
                                        ? listWithPrivateKey.map((eachPermission) => (
                                            <tbody className="accountRow" key={eachPermission.account+""+eachPermission.permission}> 
                                              <tr key={eachPermission._id}>
                                                <td width="7%">
                                                  <div style={{marginTop: "14px"}}>                                                
                                                    <RadioButtonDivStyled>
                                                      <label className="radioContainer">
                                                        <input name={eachPermission._id}
                                                          type="radio"
                                                          checked={eachPermission._id === defaultId ? true : false}
                                                          onClick={() => setAsDefault(eachPermission._id, 
                                                            eachPermission.account, 
                                                            eachPermission.permission)}
                                                          readOnly />
                                                        <span className="checkmark"></span>
                                                      </label>
                                                    </RadioButtonDivStyled>  
                                                  </div>                                                  
                                                </td>  
                                                <td width="53%">
                                                  <div style={{marginTop: "6px"}}>
                                                    <PermissionLink to={`/account/${eachPermission.account}`}>
                                                      {eachPermission.account}@{eachPermission.permission}
                                                    </PermissionLink>
                                                  </div>                                            
                                                </td>
                                                <EditButtonCell width="40%">
                                                  <ButtonPrimary 
                                                        style={{float:'right', marginRight:'5%'}}
                                                        onClick={() => getKeysData(eachPermission, list, "edit")}
                                                        disabled={isDefaultEosio(eachPermission)}
                                                        block
                                                        >
                                                        {
                                                          (isDefaultEosio(eachPermission)) ? 
                                                            "Uneditable" : "Edit"
                                                        }
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
                              </FirstCardStyled>                              
                              { (listWithoutPrivateKey.length > 0) 
                                ? <FirstCardStyled>
                                  <CardHeaderStyled>Import Account</CardHeaderStyled>
                                  <CardBody>
                                    <InfoDivStyled>
                                      The accounts in this panel do not have private keys assigned to them yet. You can click 
                                      the "Import Keys" button to assign your private keys to these accounts. <b>Note:</b> Be 
                                      sure that the private keys you import to the accounts here correspond to the public
                                      key fetched from the MongoDB. Otherwise you won't be able to do anything with them, even
                                      if you import keys. 
                                    </InfoDivStyled>
                                    <PermissionTable borderless>
                                    {
                                      listWithoutPrivateKey.map((eachPermission) => (
                                        <tbody className="accountRow" key={eachPermission.account+""+eachPermission.permission}>
                                          <tr key={eachPermission.permission}>
                                            <td width="2%"></td>
                                            <td width="58%" style={{verticalAlign: "middle"}}>
                                              <PermissionLink to={`/account/${eachPermission.account}`}>
                                                {eachPermission.account}@{eachPermission.permission}
                                              </PermissionLink>                                              
                                            </td>
                                            <EditButtonCell width="40%">
                                              <ButtonPrimary 
                                                    style={{float:'right', marginRight:'5%'}}
                                                    onClick={() => getKeysData(eachPermission, list, "importer")}
                                                    block
                                                    >
                                                    Import Keys
                                                  </ButtonPrimary>
                                            </EditButtonCell> 
                                          </tr>
                                        </tbody>
                                      ))
                                    }
                                  </PermissionTable>
                                  </CardBody>
                                </FirstCardStyled>
                                : null
                              }
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
