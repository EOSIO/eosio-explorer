import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { Button, Row, Col, CardTitle, Form } from 'reactstrap';
import styled from 'styled-components';
import { push } from 'connected-react-router'
import { pollingStart, pollingStop, smartContractNameSearch, recordsUpdate } from './ActionlistReducer';
import { LoadingSpinner, LimitSelectDropdown } from 'components';
import { TableStyled, ButtonPrimary, InputStyled } from 'styled';

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
            {payload.length > 0 &&
              <Col xs="12" className="text-right">
                <LimitSelectDropdown limit={records} onChange={(limit) => { props.recordsUpdate(limit) }} />
              </Col>
            }
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
