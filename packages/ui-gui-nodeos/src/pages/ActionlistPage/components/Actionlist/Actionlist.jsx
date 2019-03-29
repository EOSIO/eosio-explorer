import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Table, Button, Row, Col, CardTitle, Input, Form } from 'reactstrap';
import styled from 'styled-components';

import { pollingStart, pollingStop, smartContractNameSearch } from './ActionlistReducer';
import { LoadingSpinner } from 'components';
import SearchButton from 'styled/SearchButton';

const InputStyled = styled(Input)`
  min-width: 250px;
  margin-top: -6px;
`
const TrClickable = styled.tr`
  cursor: pointer;
  :hover {
    background: rgba(32, 168, 216, 0.07) !important;
    color: #1ea7d8;
  }
`

const Actionlist = (props) => {

  useEffect(()=>{
    props.pollingStart();
    return () => { props.pollingStop() }
  }, [])

  let { actionlist: { isFetching, data, smartContractName } } = props;
  let { payload = [], error } = data;

  return (
    <div className="Actionlist">
      <Row>
        <Col xs="12" className="text-right">
          <CardTitle>
            <Form onSubmit={(e) => {
                e.preventDefault();
                let val = e.target.smartContractNameSearch.value;
                if(smartContractName) {
                  props.smartContractNameSearch("");
                  e.target.smartContractNameSearch.value = "";
                } else {
                  props.smartContractNameSearch(val);
                }
              }} style={{display:"inline-flex"}}>
              <label>Filter&nbsp;by&nbsp;Smart&nbsp;Contract&nbsp;Name:&nbsp;&nbsp;</label>
              <InputStyled disabled={!!smartContractName} name="smartContractNameSearch" placeholder="Smart Contract Name..." defaultValue={smartContractName} />
              <SearchButton color="primary">{smartContractName ? "Clear" : "Filter"}</SearchButton>
            </Form>
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
          <Table responsive striped>
            <thead>
              <tr className="font-weight-bold">
                <th>Smart Contract Name</th>
                <th>Action Type</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {payload.length < 1 ?
                <tr><td colSpan="3" className="text-center">No actions could be found for the given Smart Contract name</td></tr>
              : payload.map((action, index)=>
                <TrClickable key={index} onClick={() => { window.open(`/action/${action.receipt.act_digest}`, "_blank") }}>
                  <td>{action.act.account}</td>
                  <td>{action.act.name}</td>
                  <td>{action.createdAt}</td>
                </TrClickable>
              )}
            </tbody>
          </Table>
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
  }

)(Actionlist);
