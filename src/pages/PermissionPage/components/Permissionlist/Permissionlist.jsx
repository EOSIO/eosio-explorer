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

  useEffect(()=>{
    props.fetchStart();
  }, [])

  function getKeysData (permissionObj, list, panel) {
    const keysData = list.filter(acct => acct["account"] === permissionObj.account);   
    let editOrImportPermission = keysData.filter(eachPermission => eachPermission.permission === permissionObj.permission );
    props.accountImport(editOrImportPermission);
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
