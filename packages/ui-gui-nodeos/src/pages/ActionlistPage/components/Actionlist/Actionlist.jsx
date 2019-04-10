import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { Button, Row, Col, CardTitle, Form, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import styled from 'styled-components';
import { push } from 'connected-react-router'
import { pollingStart, pollingStop, smartContractNameSearch, recordsUpdate } from './ActionlistReducer';
import { LoadingSpinner } from 'components';
import { TableStyled, ButtonPrimary, InputStyled, DropdownStyled} from 'styled';

const FormStyled = styled(Form)`
  display: flex;
  justify-content: flex-end;
`
const FilterLabel = styled.label`
  padding-right: 10px;
  margin-top: 10px;
`
const FilterInputStyled = styled(InputStyled)`
  width: 30%;
  margin-right: 10px;
`

const Actionlist = (props) => {

  useEffect(()=>{
    props.pollingStart();
    return () => { props.pollingStop() }
  }, [])

  let { actionlist: { isFetching, data, smartContractName, records } } = props;
  let { payload = [], error } = data;

  const [isOpenDropDownSmartContract, toggleDropDownSmartContract] = useState(false);

  return (
    <div className="Actionlist">
      <Row>
        <Col xs="12" className="text-right">
          <CardTitle>            
            <FormStyled onSubmit={(e) => {
                e.preventDefault();
                let val = e.target.smartContractNameSearch.value;
                if(smartContractName) {
                  props.smartContractNameSearch("");
                  e.target.smartContractNameSearch.value = "";
                } else {
                  props.smartContractNameSearch(val);
                }
              }}>
              <FilterLabel>Filter by Smart Contract Name:</FilterLabel>
              <FilterInputStyled disabled={!!smartContractName} name="smartContractNameSearch" placeholder="Smart Contract Name..." defaultValue={smartContractName} />
              <ButtonPrimary color="primary">{smartContractName ? "Clear" : "Filter"}</ButtonPrimary>
            </FormStyled>
          </CardTitle>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
        { error ? 
          <div className="text-center">
            <p className="text-danger">{JSON.stringify(error)}</p>
            <Button color="primary" onClick={props.pollingStart}>Click to Reload</Button>
          </div>
        : isFetching ? (
          <LoadingSpinner />
        ) : (
          <Row>
            <Col xs="12">
              <TableStyled borderless>
                <thead>
                  <tr>
                    <th width="33%">Smart Contract Name</th>
                    <th width="33%">Action Type</th>
                    <th width="34%">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {payload.length < 1 
                    ? <tr><td colSpan="3" className="text-center">No actions could be found for the given Smart Contract name</td></tr>
                    : payload.map((action, index)=>
                      <tr onClick={evt=>props.push(`/action/${action.block_num}/${action.receipt.global_sequence}`)} key={index}>
                        <td>{action.act.account}</td>
                        <td>{action.act.name}</td>
                        <td>{action.createdAt}</td>
                      </tr>)}
                </tbody>
              </TableStyled>
            </Col>
            <Col xs="12" className="text-right">
              <DropdownStyled isOpen={isOpenDropDownSmartContract} toggle={() => { toggleDropDownSmartContract(!isOpenDropDownSmartContract) }}>
                <DropdownToggle caret>{records}</DropdownToggle>
                <DropdownMenu>
                  {/* {smartContractsList &&
                    (smartContractsList).map((smartContract) =>
                      <DropdownItem
                        key={smartContract._id}
                        onClick={(e) => {
                          // When Smart Contract Name is changed: update the action object, rebuild the Action Type list and update useForm validation values
                          updateAction("smartContractName", action, smartContract.name, props.updateActionToPush);
                          updateAction("actionType", action, "", props.updateActionToPush);
                          setActionList(smartContract.abi.actions);
                          handleChange(e);
                          resetValidation(e);
                        }}>
                        {smartContract.name}
                      </DropdownItem>)} */}
                      <DropdownItem onClick={(e) => { props.recordsUpdate(10) }}>10</DropdownItem>
                      <DropdownItem onClick={(e) => { props.recordsUpdate(20) }}>20</DropdownItem>
                      <DropdownItem onClick={(e) => { props.recordsUpdate(50) }}>50</DropdownItem>
                      <DropdownItem onClick={(e) => { props.recordsUpdate(100) }}>100</DropdownItem>
                </DropdownMenu>
              </DropdownStyled>
            </Col>
          </Row>
        )}
        </Col>
      </Row>
    </div>
  );
}

export default connect(
  ({ actionlistPage: { actionlist }}) => ({
    actionlist
  }),
  {
    pollingStart,
    pollingStop,
    smartContractNameSearch,
    recordsUpdate,
    push
  }

)(Actionlist);
