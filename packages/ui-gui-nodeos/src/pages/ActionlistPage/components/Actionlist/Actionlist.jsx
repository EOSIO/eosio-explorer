import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { Row, Col, CardTitle, Form } from 'reactstrap';
import styled from 'styled-components';
import { push } from 'connected-react-router'
import { pollingStart, pollingStop, smartContractNameSearch, recordsUpdate } from './ActionlistReducer';
import { LoadingSpinner, LimitSelectDropdown } from 'components';
import { TableStyled, ButtonPrimary, ButtonSecondary, InputStyled } from 'styled';

const FormStyled = styled(Form)`
  display: flex;
  justify-content: flex-end;
`
const FilterInputStyled = styled(InputStyled)`
  width: 38%;
  margin-right: 10px;
`
const CustomErrorButton = styled(ButtonSecondary)`
  width: auto;
`

const Actionlist = (props) => {

  useEffect(()=>{
    props.pollingStart();
    return () => { props.pollingStop() }
  }, [])
  const [inputValue, setInputValue] = useState("");
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
                  setInputValue("");
                  e.target.smartContractNameSearch.value = "";
                } else {
                  props.smartContractNameSearch(val);
                  setInputValue(val);
                }
              }}>
              <FilterInputStyled
                  disabled={!!smartContractName} 
                  name="smartContractNameSearch" 
                  placeholder="Smart Contract Name..." 
                  defaultValue={smartContractName} 
                  onChange={evt=>{setInputValue(evt.target.value)}}/>
              <ButtonPrimary color="primary" disabled = { inputValue  === "" }>{smartContractName ? "Clear" : "Filter"}</ButtonPrimary>
            </FormStyled>
          </CardTitle>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
        { error ? 
          <CustomErrorButton onClick={props.pollingStart}>Connection error, click to reload</CustomErrorButton>
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
                <tbody className="hashText">
                  {payload.length < 1 
                    ? <tr><td colSpan="3" className="text-center">No actions found for the Smart Contract Name</td></tr>
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
