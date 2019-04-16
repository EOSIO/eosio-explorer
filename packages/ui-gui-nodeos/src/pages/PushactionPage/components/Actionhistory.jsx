import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { LoadingSpinner, LimitSelectDropdown } from 'components';
import styled from 'styled-components';
import { TableStyled, ButtonPrimary} from 'styled';
import { recordsUpdate } from '../PushactionPageReducer';

const CustomButton = styled(ButtonPrimary)`
  margin: 0 auto;
  padding-top: 4px;
  height: 32px;
`

const TableStyledNoPointer = styled(TableStyled)`
  tbody tr:hover{
    cursor: initial;
  }
`

const Actionhistory = (props) => {

  let { pushactionPage: { isFetching, data: { actionsList = [] }, records } } = props;

  return (
    <div className="Actionhistory">
      <Row>
        <Col xs="12">
        { isFetching ? (
          <LoadingSpinner />
        ) : (
          <Row>
            <Col xs="12">
              <TableStyledNoPointer borderless>
                <thead>
                  <tr className="font-weight-bold">
                    <th width="20%">Smart Contract Name</th>
                    <th width="20%">Action Type</th>
                    <th width="25%">Timestamp</th>
                    <th width="20%">Permission</th>
                    <th width="15%" className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {actionsList.length < 1 ?
                    <tr><td colSpan="5" className="text-center">No actions could be found for the given Smart Contract name</td></tr>
                  : actionsList.map((action, index)=>
                    <tr key={index} data-globalsequence={action.receipt.global_sequence}>
                      <td>{action.act.account}</td>
                      <td>{action.act.name}</td>
                      <td>{action.createdAt}</td>
                      <td>{(action.act.authorization.length > 0) ? action.act.authorization[0].actor + "@" + action.act.authorization[0].permission : ""}</td>
                      <td className="text-center">
                        {/* When the prefill button is clicked, call the prefill callback supplied by the parent component */}
                        <CustomButton block size="sm" onClick={(e) => { e.preventDefault(); props.prefillCallback(action); }}>Prefill</CustomButton>
                      </td>
                    </tr>
                  )}
                </tbody>
              </TableStyledNoPointer>
            </Col>
            {actionsList.length > 0 &&
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
  ({ pushactionPage, router}) => ({
    pushactionPage,
    router
  }),
  {
    recordsUpdate
  }
)(Actionhistory);
